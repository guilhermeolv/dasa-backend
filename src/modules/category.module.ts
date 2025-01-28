import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from '../controllers/CategoryController';
import { CategoryService } from '../services/CategoryService';
import { Category } from '../models/Category';
import { User } from '../models/User';
import { CacheModule } from '@nestjs/cache-manager';
import { cacheConfig } from '../config/cache.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, User]),
    CacheModule.register(cacheConfig)
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService]
})
export class CategoryModule {} 