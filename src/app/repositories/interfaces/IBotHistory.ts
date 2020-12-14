import { BotHistory } from '@entities/BotHistory'

export interface IProductBotHistoryDTO{
  id?: string
  name: string
  historyId?: string
  price: number
  freight?: string
  parceledOut?: string
  link: string
}

export interface IBotHistoryAttributes{
  id?: string
  userId: string
  createdAt?: Date
  updatedAt?: Date
}

export interface IBotHistoryRepository{
  create(data: IBotHistoryAttributes): Promise<BotHistory>
  createProducts (products: IProductBotHistoryDTO[], historyId: string): Promise<BotHistory>
}
