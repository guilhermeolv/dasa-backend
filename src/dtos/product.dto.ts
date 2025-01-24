import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
export class CreateProductDto {
    @ApiProperty({ description: 'Nome do produto' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'Descrição do produto' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ description: 'Preço do produto' })
    @IsNumber()
    @IsNotEmpty()
    price: number;

    @ApiProperty({ description: 'Id do usuário dono do produto' })
    @IsNumber()
    @IsNotEmpty()
    ownerId: number;

    @ApiProperty({ description: 'Id da categoria do produto' })
    @IsNumber()
    @IsOptional()
    categoryId?: number;
}

export class UpdateProductDto {
    @ApiProperty({ description: 'Nome do produto' })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ description: 'Descrição do produto' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ description: 'Preço do produto' })
    @IsNumber()
    @IsOptional()
    price?: number;

    @ApiProperty({ description: 'Id do usuário dono do produto' })
    @IsNumber()
    @IsOptional()
    ownerId?: number;

    @ApiProperty({ description: 'Id da categoria do produto' })
    @IsNumber()
    @IsOptional()
    categoryId?: number;
}