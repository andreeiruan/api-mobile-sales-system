import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Product } from './Product'
import { Sale } from './Sale'
import { User } from './User'

@Entity('salesProducts')
export class SalesProducts {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('float')
  unitaryValue: number

  @Column('float')
  discountUnitary?: number

  @Column('int')
  amount: number

  @JoinColumn({ name: 'userId' })
  @ManyToOne(() => User, user => user.salesProducts)
  user: User

  @Column('uuid')
  userId: string

  @JoinColumn({ name: 'productId' })
  @ManyToOne(() => Product, product => product.salesProducts)
  product: Product

  @Column('uuid')
  productId: string

  @JoinColumn({ name: 'saleId' })
  @ManyToOne(() => Sale, sale => sale.salesProducts)
  sale: Sale

  @Column('uuid')
  saleId: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
