import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../models/Product';
import { User } from '../models/User';
import { Category } from '../models/Category';
import { CreateProductDto } from '../dtos/product.dto';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>
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
        return await this.productRepository.find({
            relations: ["owner", "category"]
        });
    }

    async findOne(id: number): Promise<Product> {
        const product = await this.productRepository.findOne({
            where: { id },
            relations: ["owner", "category"]
        });

        if (!product) {
            throw new NotFoundException('Produto não encontrado');
        }

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

        Object.assign(product, data);
        return await this.productRepository.save(product);
    }

    async remove(id: number): Promise<void> {
        const product = await this.findOne(id);
        
        if (product.owner) {
            throw new Error('Não é possível excluir um produto que possui proprietário');
        }

        await this.productRepository.remove(product);
    }

    async findByOwner(ownerId: number): Promise<Product[]> {
        return await this.productRepository.find({
            where: { owner: { id: ownerId } },
            relations: ["owner"]
        });
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
    }
} 