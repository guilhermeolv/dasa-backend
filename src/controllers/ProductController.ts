import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateProductDto } from '../dtos/product.dto';
import { ProductService } from '../services/ProductService';

@ApiTags('Products')
@Controller('products')
export class ProductController {
    constructor(
        private productService: ProductService
    ) {}

    @Post()
    @ApiOperation({ summary: 'Criar novo produto' })
    @ApiResponse({ status: 201, description: 'Produto criado com sucesso' })
    async create(@Body() data: CreateProductDto) {
        return await this.productService.create(data);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todos os produtos' })
    async list() {
        return await this.productService.findAll();
    }

    @ApiOperation({ summary: 'Buscar produto por ID' })
    @ApiResponse({ status: 200, description: 'Produto encontrado' })
    @ApiResponse({ status: 404, description: 'Produto não encontrado' })
    async find(@Param('id') id: string) {
        return await this.productService.findOne(Number(id));
    }

    @Put(':id')
    @ApiOperation({ summary: 'Atualizar produto' })
    @ApiResponse({ status: 204, description: 'Produto atualizado com sucesso' })
    @ApiResponse({ status: 404, description: 'Produto não encontrado' })
    @ApiBody({ type: CreateProductDto })
    async update(@Param('id') id: string, @Body() data: Partial<CreateProductDto>) {
        return await this.productService.update(Number(id), data);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Deletar produto' })
    @ApiResponse({ status: 204, description: 'Produto deletado com sucesso' })
    @ApiResponse({ status: 404, description: 'Produto não encontrado' })
    async delete(@Param('id') id: string) {
        return await this.productService.delete(Number(id));
    }

    @Put(':id/category/:categoryId')
    @ApiOperation({ summary: 'Associar produto a uma categoria' })
    @ApiResponse({ status: 204, description: 'Categoria associada com sucesso' })
    @ApiResponse({ status: 404, description: 'Produto ou categoria não encontrada' })
    async associateCategory(@Param('id') id: string, @Param('categoryId') categoryId: string) {
        return await this.productService.associateCategory(Number(id), Number(categoryId));
    }

    @Get('owner/:ownerId')
    @ApiOperation({ summary: 'Buscar produtos por ID do proprietário' })
    @ApiResponse({ status: 200, description: 'Produtos encontrados' })
    @ApiResponse({ status: 404, description: 'Produtos não encontrados' })
    async findByOwner(@Param('ownerId') ownerId: string) {
        return await this.productService.findByOwner(Number(ownerId));
    }
}   