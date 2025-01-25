import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CategoryService } from '../services/CategoryService';
import { CreateCategoryDto } from '../dtos/category.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
    constructor(
        private categoryService: CategoryService
    ) {}

    @Post()
    @ApiOperation({ summary: 'Criar nova categoria' })
    @ApiResponse({ status: 201, description: 'Categoria criada com sucesso' })
    @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
    async create(@Body() data: CreateCategoryDto) {
        return await this.categoryService.create(data);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todas as categorias' })
    async list() {
        return await this.categoryService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar categoria por ID' })
    @ApiResponse({ status: 200, description: 'Categoria encontrada' })
    @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
    async find(@Param('id') id: string) {
        return await this.categoryService.findOne(Number(id));
    }

    @Put(':id')
    @ApiOperation({ summary: 'Atualizar categoria' })
    @ApiResponse({ status: 200, description: 'Categoria atualizada com sucesso' })
    @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
    @ApiBody({ type: CreateCategoryDto })
    async update(@Param('id') id: string, @Body() data: Partial<CreateCategoryDto>) {
        return await this.categoryService.update(Number(id), data);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Deletar categoria' })
    async delete(@Param('id') id: string) {
        await this.categoryService.remove(Number(id));
        return { message: 'Categoria removida com sucesso' };
    }

    @Get('owner/:ownerId')
    @ApiOperation({ summary: 'Listar categorias por proprietário' })
    async findByOwner(@Param('ownerId') ownerId: string) {
        return await this.categoryService.findByOwner(Number(ownerId));
    }
}
