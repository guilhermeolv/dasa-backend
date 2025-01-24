import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Product } from '../models/Product';
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@ApiTags('Products')
@Controller('products')
export class ProductController {
    constructor(
        @InjectRepository(Product)
        private repository: Repository<Product>
    ) {}

    @Post()
    @ApiOperation({ summary: 'Criar novo produto' })
    @ApiResponse({ status: 201, description: 'Produto criado com sucesso' })
    async create(@Body() data: CreateProductDto) {
        const product = this.repository.create(data);
        return await this.repository.save(product);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todos os produtos' })
    async list() {
        return await this.repository.find({
            relations: ["owner", "category"]
        });
    }

    @ApiOperation({ summary: 'Buscar produto por ID' })
    @ApiResponse({ status: 200, description: 'Produto encontrado' })
    @ApiResponse({ status: 404, description: 'Produto não encontrado' })
    async find(@Param('id') id: string) {
        const product = await this.repository.findOne({
            where: { id: Number(id) },
            relations: ["owner", "category"]
        });
        if (!product) {
            return { message: "Produto não encontrado" };
        }
        return product;
    }

    @Put(':id')
    @ApiOperation({ summary: 'Atualizar produto' })
    @ApiResponse({ status: 204, description: 'Produto atualizado com sucesso' })
    @ApiResponse({ status: 404, description: 'Produto não encontrado' })
    async update(@Param('id') id: string, @Body() data: UpdateProductDto) {
        const result = await this.repository.update(id, data);
        if (result.affected === 0) return { message: "Produto não encontrado" };
        return { message: "Produto atualizado com sucesso" };
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Deletar produto' })
    @ApiResponse({ status: 204, description: 'Produto deletado com sucesso' })
    @ApiResponse({ status: 404, description: 'Produto não encontrado' })
    async delete(@Param('id') id: string) {
        const result = await this.repository.delete(id);
        if (result.affected === 0) return { message: "Produto não encontrado" };
        return { message: "Produto deletado com sucesso" };
    }

    @ApiOperation({ summary: 'Associar produto a uma categoria' })
    @ApiResponse({ status: 204, description: 'Categoria associada com sucesso' })
    @ApiResponse({ status: 404, description: 'Produto ou categoria não encontrada' })
    async associateCategory(@Param('id') id: string, @Param('categoryId') categoryId: string) {
        const product = await this.repository.findOneBy({ id: Number(id) });
        if (!product) {
            return { message: "Produto não encontrado" };
        }
        product.category = { id: Number(categoryId) } as any;
        await this.repository.save(product);
        return { message: "Categoria associada com sucesso" };
    }
}   
