import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Product } from './Product'
import { Shipment } from './Shipment'
import { User } from './User'

@Entity('shipmentsProducts')
export class ShipmentProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('uuid')
  shipmentId: string

  @ManyToOne(() => Shipment, shipment => shipment.id)
  shipment: Shipment

  @Column('uuid')
  userId: string

  @ManyToOne(() => User, user => user.id)
  user: User

  @Column('uuid')
  productId: string

  @ManyToOne(() => Product, product => product.id)
  product: Product

  @Column('float')
  unitaryValue: number

  @Column('int')
  amount: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
