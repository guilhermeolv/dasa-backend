import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateCategoryDto {
    @ApiProperty({ description: 'Nome da categoria' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ description: 'Descrição da categoria' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ description: 'Id do usuário dono da categoria' })
    @IsNumber()
    @IsNotEmpty()
    ownerId: number;
} 