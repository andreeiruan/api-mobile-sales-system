import { Shipment } from '@entities/Shipment'

interface IProductShipmentDTO{
  id: string,
  unitaryValue: number
  amount: number
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
  listMonthByUserId(userId:string, month: number, year: number): Promise<Shipment[]>
  findById(id: string): Promise<Shipment>
}
