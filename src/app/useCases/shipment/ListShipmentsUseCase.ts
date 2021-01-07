import { NotFoundError } from '@helpers/errors/notFoundError'
import { ServerError } from '@helpers/errors/serverError'
import { HttpResponse, IHttpResponse } from '@helpers/HttpResponse'
import { appLogger } from '@helpers/Logger'
import { IShipmentRepository } from '@repositories/interfaces/IShipmentRepository'
import { IUserRepository } from '@repositories/interfaces/IUserRepository'

export class ListShipmentsUseCase {
  private readonly _userRepository: IUserRepository
  private readonly _shipmentRepository: IShipmentRepository

  constructor (userRepository: IUserRepository,
    shipmentRepository: IShipmentRepository) {
    this._userRepository = userRepository
    this._shipmentRepository = shipmentRepository
  }

  async execute (userId: string, month: number, year: number): Promise<IHttpResponse> {
    try {
      const userExists = this._userRepository.findById(userId)
      if (!userExists) {
        appLogger.logError({ error: 'User not found by id', filename: __filename, id: userId })
        return HttpResponse.notFound(new NotFoundError('User'))
      }

      const shipments = await this._shipmentRepository.listMonthByUserId(userId, month, year)

      return HttpResponse.ok(shipments)
    } catch (error) {
      appLogger.logError({ error: error.message, filename: __filename })
      return HttpResponse.serverError(new ServerError())
    }
  }
}
