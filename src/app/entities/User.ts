import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Product } from './Product'
import { SalesProducts } from './SaleProducts'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  name: string

  @Column('varchar')
  email: string

  @Column('varchar')
  password: string

  @OneToMany(() => Product, product => product.userId)
  products: Product[]

  @OneToMany(() => SalesProducts, salesProducts => salesProducts.user)
  salesProducts: SalesProducts[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
