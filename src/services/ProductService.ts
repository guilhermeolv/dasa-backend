import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../models/Product';
import { User } from '../models/User';
import { Category } from '../models/Category';
import { CreateProductDto } from '../dtos/product.dto';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    private logCacheOperation(operation: string, key: string) {
        console.log(`🔄 Redis Operation: ${operation} - Key: ${key}`);
    }

    async create(data: CreateProductDto): Promise<Product> {
        const user = await this.userRepository.findOne({
            where: { id: data.ownerId }
        });

        if (!user) {
            throw new NotFoundException('Usuário não encontrado');
        }

        let category = null;
        if (data.categoryId) {
            category = await this.categoryRepository.findOne({
                where: { id: data.categoryId }
            });

            if (!category) {
                throw new NotFoundException('Categoria não encontrada');
            }
        }

        console.log(data);
        const product = this.productRepository.create({
            ...data,
            owner: user,
            category: category
        });
        
        const savedProduct = await this.productRepository.save(product);
        
        await this.invalidateProductCaches();
        await this.invalidateOwnerCache(savedProduct.owner.id);
        
        return savedProduct;
    }

    async findAll(): Promise<Product[]> {
        this.logCacheOperation('GET', 'all_products');
        const cachedProducts = await this.cacheManager.get<Product[]>('all_products');
        
        if (cachedProducts) {
            console.log('✅ Cache HIT: Dados recuperados do Redis - Key: all_products');
            return cachedProducts;
        }

        console.log('❌ Cache MISS: Buscando dados do banco - Key: all_products');
        const products = await this.productRepository.find({
            relations: ["owner", "category"]
        });

        this.logCacheOperation('SET', 'all_products');
        await this.cacheManager.set('all_products', products);
        return products;
    }

    async findOne(id: number): Promise<Product> {
        const cacheKey = `product_${id}`;
        this.logCacheOperation('GET', cacheKey);
        const cachedProduct = await this.cacheManager.get<Product>(cacheKey);
        
        if (cachedProduct) {
            console.log(`✅ Cache HIT: Produto encontrado no Redis - Key: ${cacheKey}`);
            return cachedProduct;
        }

        console.log(`❌ Cache MISS: Buscando produto no banco - Key: ${cacheKey}`);
        const product = await this.productRepository.findOne({
            where: { id },
            relations: ["owner", "category"]
        });

        if (!product) {
            throw new NotFoundException('Produto não encontrado');
        }

        this.logCacheOperation('SET', cacheKey);
        await this.cacheManager.set(cacheKey, product);
        return product;
    }

    async update(id: number, data: Partial<CreateProductDto>): Promise<Product> {
        const product = await this.findOne(id);
        const oldOwnerId = product.owner?.id;

        if (data.ownerId) {
            const user = await this.userRepository.findOne({
                where: { id: data.ownerId }
            });

            if (!user) {
                throw new NotFoundException('Usuário não encontrado');
            }
            product.owner = user;
        }

        if (data.categoryId) {
            const category = await this.categoryRepository.findOne({
                where: { id: data.categoryId }
            });

            if (!category) {
                throw new NotFoundException('Categoria não encontrada');
            }
            product.category = category;
        }

        const updatedProduct = Object.assign({}, product, data);
        const savedProduct = await this.productRepository.save(updatedProduct);
        
        await this.invalidateProductCaches();
        if (oldOwnerId) {
            await this.invalidateOwnerCache(oldOwnerId);
        }
        if (data.ownerId && data.ownerId !== oldOwnerId) {
            await this.invalidateOwnerCache(data.ownerId);
        }
        
        return savedProduct;
    }

    async remove(id: number): Promise<void> {
        const product = await this.findOne(id);
        const ownerId = product.owner?.id;
        
        if (product.owner) {
            throw new Error('Não é possível excluir um produto que possui proprietário');
        }
        
        await this.productRepository.remove(product);
        
        await this.invalidateProductCaches();
        if (ownerId) {
            await this.invalidateOwnerCache(ownerId);
        }
    }

    async findByOwner(ownerId: number): Promise<Product[]> {
        const cachedProducts = await this.cacheManager.get<Product[]>(`products_by_owner_${ownerId}`);
        if (cachedProducts) {
            return cachedProducts;
        }

        const products = await this.productRepository.find({
            where: { owner: { id: ownerId } },
            relations: ["owner", "category"]
        });
        await this.cacheManager.set(`products_by_owner_${ownerId}`, products);
        return products;
    }

    async associateCategory(productId: number, categoryId: number): Promise<void> {
        const product = await this.findOne(productId);
        const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
        product.category = category;
        await this.productRepository.save(product);
    }

    async delete(id: number): Promise<void> {
        const product = await this.findOne(id);
        const ownerId = product.owner?.id;
        
        await this.productRepository.remove(product);
        
        await this.invalidateProductCaches();
        if (ownerId) {
            await this.invalidateOwnerCache(ownerId);
        }
    }

    // Adicionar novos métodos auxiliares para gerenciar o cache
    private async invalidateProductCaches(): Promise<void> {
        this.logCacheOperation('DELETE', 'all_products');
        await this.cacheManager.del('all_products');
    }

    private async invalidateOwnerCache(ownerId: number): Promise<void> {
        const ownerCacheKey = `products_by_owner_${ownerId}`;
        this.logCacheOperation('DELETE', ownerCacheKey);
        await this.cacheManager.del(ownerCacheKey);
    }
} 