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
        
        return await this.productRepository.save(product);
    }

    async findAll(): Promise<Product[]> {
        const cachedProducts = await this.cacheManager.get<Product[]>('all_products');
        if (cachedProducts) {
            return cachedProducts;
        }

        const products = await this.productRepository.find({
            relations: ["owner", "category"]
        });

        await this.cacheManager.set('all_products', products);
        return products;
    }

    async findOne(id: number): Promise<Product> {
        const cacheKey = `product_${id}`;
        const cachedProduct = await this.cacheManager.get<Product>(cacheKey);
        
        if (cachedProduct) {
            return cachedProduct;
        }

        const product = await this.productRepository.findOne({
            where: { id },
            relations: ["owner", "category"]
        });

        if (!product) {
            throw new NotFoundException('Produto não encontrado');
        }

        await this.cacheManager.set(cacheKey, product);
        return product;
    }

    async update(id: number, data: Partial<CreateProductDto>): Promise<Product> {
        const product = await this.findOne(id);

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
        return await this.productRepository.save(updatedProduct);
    }

    async remove(id: number): Promise<void> {
        const product = await this.findOne(id);
        
        if (product.owner) {
            throw new Error('Não é possível excluir um produto que possui proprietário');
        }

        await this.productRepository.remove(product);
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
        await this.productRepository.remove(product);
        await this.cacheManager.del('all_products');
        await this.cacheManager.del(`product_${id}`);
    }
} 