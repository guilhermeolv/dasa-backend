import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '../controllers/UserController';
import { User } from '../models/User';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
})
export class UserModule {} 