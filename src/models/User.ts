import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from './Product';
import { Category } from './Category';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Product, (product) => product.owner)
  products: Product[];

  @OneToMany(() => Category, (category) => category.owner)
  categories: Category[];
}
