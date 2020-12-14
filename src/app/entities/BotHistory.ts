import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { ProductsBotHistory } from './ProductsBotHistory'

@Entity('botHistory')
export class BotHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('uuid')
  userId: string

  @Column('varchar')
  product: string

  @OneToMany(() => ProductsBotHistory, productsBotHistory => productsBotHistory.botHistory, { eager: true })
  productsBotHistory: ProductsBotHistory[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: string
}
