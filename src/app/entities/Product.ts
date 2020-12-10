import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { ShipmentProduct } from './ShipmentProduct'
import { User } from './User'

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  name: string

  @Column('varchar')
  brand: string

  @Column('float')
  saleValue: number

  @Column('int')
  amount: number

  @Column('uuid')
  userId: string

  @OneToMany(() => ShipmentProduct, shipmentProduct => shipmentProduct.product)
  shipmentProducts: ShipmentProduct[]

  @ManyToOne(() => User)
  user: User

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date
}
