import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../models/User';
import { CreateUserDto } from '../dtos/user.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor(
        @InjectRepository(User)
        private repository: Repository<User>
    ) {}

    @Post()
    @ApiOperation({ summary: 'Criar novo usuário' })
    @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
    async create(@Body() data: CreateUserDto) {
        const user = this.repository.create(data);
        return await this.repository.save(user);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todos os usuários' })
    async list() {
        return await this.repository.find({
            relations: ["products", "categories"]
        });
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar usuário por ID' })
    @ApiResponse({ status: 200, description: 'Usuário encontrado' })
    @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
    async find(@Param('id') id: string) {
        const user = await this.repository.findOne({
            where: { id: Number(id) },
            relations: ["products", "categories"]
        });
        if (!user) {
            return { message: "Usuário não encontrado" };
        }
        return user;
    }
}
