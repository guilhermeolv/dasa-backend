import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from '../dtos/user.dto';
import { UserService } from '../services/UserService';

@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor(
        private userService: UserService
    ) {}

    @Post()
    @ApiOperation({ summary: 'Criar novo usuário' })
    @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
    async create(@Body() data: CreateUserDto) {
        return await this.userService.create(data);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todos os usuários' })
    async list() {
        return await this.userService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar usuário por ID' })
    @ApiResponse({ status: 200, description: 'Usuário encontrado' })
    @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
    async find(@Param('id') id: string) {
        return await this.userService.findOne(Number(id));
    }
}
