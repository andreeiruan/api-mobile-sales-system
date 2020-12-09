import { Product } from '@entities/Product'

export interface IProductAttributes{
  id?: string
  userId: string
  name: string
  brand?: string
  value: number
  amount: number
  createdAt?: Date
  updatedAt?: Date
}

export interface IProductRepository{
  create(data: IProductAttributes): Promise<Product>
}