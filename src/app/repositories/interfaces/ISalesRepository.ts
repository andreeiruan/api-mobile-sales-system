import { Sale } from '@entities/Sale'

export interface IProductSaleDTO{
  id?: string
  amount: number
  unitaryValue: number
  unitaryDiscount?: number
}

export interface ISalesAttributes{
  id?: string
  products: IProductSaleDTO[]
  payDate: Date
  saleTotal?: number
  discount?: number
  userId: string
  confirmPay: boolean
  partialPayment: boolean
  amountPaid?: number
  remainingAmount?: number
  nameCliente: string
  createdAt?: Date
  updatedAt?: Date
}

export interface ISalesRepository{
  create(data: ISalesAttributes): Promise<Sale>
  listMonthByUserId(userId:string, month?: number, year?: number): Promise<Sale[]>
  findById(id: string): Promise<Sale>
}
