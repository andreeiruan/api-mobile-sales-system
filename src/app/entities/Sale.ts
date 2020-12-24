import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { SalesProducts } from './SaleProducts'

@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('timestamp')
  payDate: Date

  @Column('float')
  saleTotal: number

  @Column('float')
  discount?: number

  @Column('uuid')
  userId: string

  @Column('boolean')
  confirmPay: boolean

  @Column('varchar')
  nameCliente: string

  @OneToMany(() => SalesProducts, salesProducts => salesProducts.sale)
  salesProducts: SalesProducts[]

  @Column('boolean')
  partialPayment: boolean

  @Column('float', { nullable: true })
  amountPaid: number

  @Column('float', { nullable: true })
  remainingAmount: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
