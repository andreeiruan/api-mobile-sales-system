import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Product } from './Product'
import { Shipment } from './Shipment'
import { User } from './User'

@Entity('shipmentsProducts')
export class ShipmentProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('uuid')
  shipmentId: string

  @JoinColumn({ name: 'shipmentId' })
  @ManyToOne(() => Shipment, shipment => shipment.shipmentProducts)
  shipment: Shipment

  @Column('uuid')
  userId: string

  @ManyToOne(() => User, user => user.id)
  user: User

  @Column('uuid')
  productId: string

  @JoinColumn({ name: 'productId' })
  @ManyToOne(() => Product, product => product.shipmentProducts)
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
