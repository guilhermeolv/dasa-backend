import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { Product } from "./Product"
import { User } from "./User"

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  description: string

  @ManyToOne(() => User, user => user.categories)
  owner: User

  @OneToMany(() => Product, product => product.category)
  products: Product[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
