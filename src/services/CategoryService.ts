import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../models/Category';
import { User } from '../models/User';
import { CreateCategoryDto } from '../dtos/category.dto';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
        @InjectRepository(User)
        private userRepository: Repository<User>
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
        
        return await this.categoryRepository.save(category);
    }

    async findAll(): Promise<Category[]> {
        return await this.categoryRepository.find({
            relations: ["products", "owner"]
        });
    }

    async findOne(id: number): Promise<Category> {
        const category = await this.categoryRepository.findOne({
            where: { id },
            relations: ["products", "owner"]
        });

        if (!category) {
            throw new NotFoundException('Categoria não encontrada');
        }

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

        Object.assign(category, data);
        return await this.categoryRepository.save(category);
    }

    async remove(id: number): Promise<{ message: string }> {
        const category = await this.findOne(id);
        
        if (category.products && category.products.length > 0) {
            throw new NotFoundException('Não é possível excluir uma categoria que possui produtos!');
        }

        await this.categoryRepository.remove(category);
        return { message: 'Categoria excluída com sucesso' };
    }

    async findByOwner(ownerId: number): Promise<Category[]> {
        return await this.categoryRepository.find({
            where: { owner: { id: ownerId } },
            relations: ["products"]
        });
    }
} 