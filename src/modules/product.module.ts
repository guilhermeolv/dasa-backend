import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from '../controllers/ProductController';
import { ProductService } from '../services/ProductService';
import { Product } from '../models/Product';
import { User } from '../models/User';
import { Category } from '../models/Category';

@Module({
  imports: [TypeOrmModule.forFeature([Product, User, Category])],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService]
})
export class ProductModule {} 