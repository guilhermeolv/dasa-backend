import { ApiProperty, PartialType } from '@nestjs/swagger';
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

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
    @ApiProperty({ description: 'Nome da categoria' })
    @IsString()
    @IsOptional()
    title?: string;

    @ApiProperty({ description: 'Descrição da categoria' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ description: 'Id do usuário dono da categoria' })
    @IsNumber()
    @IsOptional()
    ownerId?: number;
}

export class DeleteCategoryDto {
    @ApiProperty({ description: 'Id da categoria a ser deletada' })
    @IsNumber()
    @IsNotEmpty()
    id: number;
}

export class FindOneCategoryDto {
    @ApiProperty({ description: 'Id da categoria' })
    @IsNumber()
    @IsNotEmpty()
    id: number;
} 