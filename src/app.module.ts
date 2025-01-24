import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './modules/product.module';
import { CategoryModule } from './modules/category.module';
import { UserModule } from './modules/user.module';
import { databaseConfig } from './database/data-source';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    ProductModule,
    CategoryModule,
    UserModule
  ]
})
export class AppModule {} 