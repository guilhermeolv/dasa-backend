import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../models/Category';
import { User } from '../models/User';
import { CreateCategoryDto } from '../dtos/category.dto';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    async create(data: CreateCategoryDto): Promise<Category> {
        const user = await this.userRepository.findOne({
            where: { id: data.ownerId }
        });

        if (!user) {
            throw new NotFoundException('Usuário não encontrado');
        }

        const category = this.categoryRepository.create({
            ...data,
            owner: user
        });
        
        const savedCategory = await this.categoryRepository.save(category);
        await this.cacheManager.del('all_categories');
        return savedCategory;
    }

    async findAll(): Promise<Category[]> {
        const cachedCategories = await this.cacheManager.get<Category[]>('all_categories');
        if (cachedCategories) {
            return cachedCategories;
        }

        const categories = await this.categoryRepository.find({
            relations: ["products", "owner"]
        });

        await this.cacheManager.set('all_categories', categories);
        return categories;
    }

    async findOne(id: number): Promise<Category> {
        const cacheKey = `category_${id}`;
        const cachedCategory = await this.cacheManager.get<Category>(cacheKey);
        
        if (cachedCategory) {
            return cachedCategory;
        }

        const category = await this.categoryRepository.findOne({
            where: { id },
            relations: ["products", "owner"]
        });

        if (!category) {
            throw new NotFoundException('Categoria não encontrada');
        }

        await this.cacheManager.set(cacheKey, category);
        return category;
    }

    async update(id: number, data: Partial<CreateCategoryDto>): Promise<Category> {
        const category = await this.findOne(id);

        if (data.ownerId) {
            const user = await this.userRepository.findOne({
                where: { id: data.ownerId }
            });

            if (!user) {
                throw new NotFoundException('Usuário não encontrado');
            }
            category.owner = user;
        }

        const updatedCategory = Object.assign({}, category, data);
        const savedCategory = await this.categoryRepository.save(updatedCategory);
        
        await this.cacheManager.del('all_categories');
        await this.cacheManager.del(`category_${id}`);
        
        return savedCategory;
    }

    async remove(id: number): Promise<{ message: string }> {
        const category = await this.findOne(id);
        
        if (category.products && category.products.length > 0) {
            throw new NotFoundException('Não é possível excluir uma categoria que possui produtos!');
        }

        await this.categoryRepository.remove(category);
        await this.cacheManager.del('all_categories');
        await this.cacheManager.del(`category_${id}`);
        
        return { message: 'Categoria excluída com sucesso' };
    }

    async findByOwner(ownerId: number): Promise<Category[]> {
        const cacheKey = `categories_by_owner_${ownerId}`;
        const cachedCategories = await this.cacheManager.get<Category[]>(cacheKey);
        
        if (cachedCategories) {
            return cachedCategories;
        }

        const categories = await this.categoryRepository.find({
            where: { owner: { id: ownerId } },
            relations: ["products"]
        });

        await this.cacheManager.set(cacheKey, categories);
        return categories;
    }
} 