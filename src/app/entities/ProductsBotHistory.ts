import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { BotHistory } from './BotHistory'

@Entity('productsBotHistory')
export class ProductsBotHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('uuid')
  historyId: string

  @JoinColumn({ name: 'historyId' })
  @ManyToOne(() => BotHistory, botHistory => botHistory.productsBotHistory)
  botHistory: BotHistory

  @Column('varchar')
  name: string

  @Column('float')
  price: number

  @Column('varchar', { nullable: true })
  freight?: string

  @Column('varchar', { nullable: true })
  parceledOut?: string

  @Column('varchar')
  link: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: string
}
