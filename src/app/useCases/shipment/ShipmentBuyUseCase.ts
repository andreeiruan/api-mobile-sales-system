import { MissingParamError } from '@helpers/errors/missingParamError'
import { NotFoundError } from '@helpers/errors/notFoundError'
import { ServerError } from '@helpers/errors/serverError'
import { HttpResponse, IHttpResponse } from '@helpers/HttpResponse'
import { appLogger } from '@helpers/Logger'
import { IShipmentRepository } from '@repositories/interfaces/IShipmentRepository'
import { IUserRepository } from '@repositories/interfaces/IUserRepository'

interface IProductShipmentDTO{
  id: string,
  name?: string
  unitaryValue: number
  amount: number
}

interface IShipmentOfBuyDTO{
  products: IProductShipmentDTO[]
  userId: string
  provider: string
}

export class ShipmentBuyUseCase {
  private readonly _userRepository: IUserRepository
  private readonly _shipmentRepository: IShipmentRepository

  constructor (userRepository: IUserRepository,
    shipmentRepository: IShipmentRepository) {
    this._userRepository = userRepository
    this._shipmentRepository = shipmentRepository
  }

  async execute (data: IShipmentOfBuyDTO): Promise<IHttpResponse> {
    try {
      const { userId, products, provider } = data

      const userExists = await this._userRepository.findById(userId)
      if (!userExists) {
        appLogger.logError({ error: 'User not found by id', filename: __filename, id: userId })
        return HttpResponse.notFound(new NotFoundError('users'))
      }

      if (!products || products.length === 0) {
        return HttpResponse.badRequest(new MissingParamError('Products'))
      }

      const amountValue = products.map(p => p.unitaryValue * p.amount)
        .reduce((s, n) => s + n)

      const shipment = await this._shipmentRepository.create({ userId, amountValue, provider, products })

      return HttpResponse.created(shipment)
    } catch (error) {
      appLogger.logError({ error: error.message, filename: __filename })
      return HttpResponse.serverError(new ServerError())
    }
  }
}
