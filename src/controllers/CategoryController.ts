import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../models/Category';
import { CreateCategoryDto } from '../dtos/category.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
    constructor(
        @InjectRepository(Category)
        private repository: Repository<Category>
    ) {}

    @Post()
    @ApiOperation({ summary: 'Criar nova categoria' })
    @ApiResponse({ status: 201, description: 'Categoria criada com sucesso' })
    async create(@Body() data: CreateCategoryDto) {
        const category = this.repository.create(data);
        return await this.repository.save(category);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todas as categorias' })
    async list() {
        return await this.repository.find({
            relations: ["products", "categories"]
        });
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar categoria por ID' })
    @ApiResponse({ status: 200, description: 'Categoria encontrada' })
    @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
    async find(@Param('id') id: string) {
        const category = await this.repository.findOne({
            where: { id: Number(id) },
            relations: ["products", "categories"]
        });
        if (!category) {
            return { message: "Categoria não encontrada" };
        }
        return category;
    }
}
