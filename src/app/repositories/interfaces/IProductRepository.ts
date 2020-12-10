import { Product } from '@entities/Product'

export interface IProductAttributes{
  id?: string
  userId: string
  name: string
  brand?: string
  saleValue: number
  amount: number
  createdAt?: Date
  updatedAt?: Date
}

export interface IProductRepository{
  create(data: IProductAttributes): Promise<Product>
  findByUserIdAndName (userId: string, name: string): Promise<Product>
  findById (id: string): Promise<Product>
  listProducts(userId:string, name?: string): Promise<Product[]>
}
