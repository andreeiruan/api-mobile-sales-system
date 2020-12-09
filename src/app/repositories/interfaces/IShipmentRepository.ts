import { Shipment } from '@entities/Shipment'

interface IProductShipmentDTO{
  id: string,
  unitaryValue: number
  amount: number
}

interface IAddStockUseCaseDTO{
  userId: string
  provider: string
}

export interface IShipmentAttributes{
  id?: string
  products: IProductShipmentDTO[]
  userId: string
  amountValue: number
  provider?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface IShipmentRepository{
  create(data: IShipmentAttributes): Promise<Shipment>
}
