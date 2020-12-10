import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { ShipmentProduct } from './ShipmentProduct'
import { User } from './User'

@Entity('shipments')
export class Shipment {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('uuid')
  userId: string

  @ManyToOne(() => User)
  user: User

  @OneToMany(() => ShipmentProduct, shipment => shipment.shipment)
  shipmentProducts: ShipmentProduct[]

  @Column('float')
  amountValue: number

  @Column('varchar')
  provider: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
