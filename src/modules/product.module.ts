import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from '../controllers/ProductController';
import { Product } from '../models/Product';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductController],
})
export class ProductModule {} 