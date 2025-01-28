import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './modules/product.module';
import { CategoryModule } from './modules/category.module';
import { UserModule } from './modules/user.module';
import { databaseConfig } from './database/data-source';
import { cacheConfig } from './config/cache.config';
import { CacheModule } from '@nestjs/cache-manager';
@Module({
  imports: [
    CacheModule.register(cacheConfig),
    TypeOrmModule.forRoot(databaseConfig),
    ProductModule,
    CategoryModule,
    UserModule
  ]
})
export class AppModule {} 