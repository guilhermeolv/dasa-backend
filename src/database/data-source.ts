import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from "../models/User";
import { Category } from "../models/Category";
import { Product } from "../models/Product";

export const databaseConfig: TypeOrmModuleOptions = {
  type: "sqlite",
  database: "src/database/database.sqlite",
  entities: [User, Category, Product],
  synchronize: false,
  logging: true,
  migrations: ["dist/database/migrations/*.js"],
  subscribers: [],
};
