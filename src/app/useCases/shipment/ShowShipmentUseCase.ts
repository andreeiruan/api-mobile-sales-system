import { NotFoundError } from '@helpers/errors/notFoundError'
import { ServerError } from '@helpers/errors/serverError'
import { HttpResponse, IHttpResponse } from '@helpers/HttpResponse'
import { appLogger } from '@helpers/Logger'
import { IShipmentRepository } from '@repositories/interfaces/IShipmentRepository'

export class ShowShipmentUseCase {
  private readonly _shipmentRepository: IShipmentRepository

  constructor (shipmentRepository: IShipmentRepository) {
    this._shipmentRepository = shipmentRepository
  }

  async execute (id: string): Promise<IHttpResponse> {
    try {
      const shipment = await this._shipmentRepository.findById(id)
      if (!shipment) {
        appLogger.logError({ error: `Shipment not found by id ${id}` })
        return HttpResponse.notFound(new NotFoundError('Shipment'))
      }

      return HttpResponse.ok(shipment)
    } catch (error) {
      console.log(error)
      appLogger.logError({ error: error.message, filename: __filename })
      return HttpResponse.serverError(new ServerError())
    }
  }
}
