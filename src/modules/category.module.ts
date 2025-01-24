import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from '../controllers/CategoryController';
import { Category } from '../models/Category';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
})
export class CategoryModule {} 