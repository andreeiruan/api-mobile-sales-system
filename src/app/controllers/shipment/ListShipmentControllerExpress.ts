import { appLogger } from '@helpers/Logger'
import { ListShipmentsUseCase } from '@useCases/shipment/ListShipmentsUseCase'
import { Request, Response } from 'express'

export class ListShipmentControllerExpress {
  private readonly _listShipmentBuyUseCase: ListShipmentsUseCase
  constructor (listShipmentBuyUseCase: ListShipmentsUseCase) {
    this._listShipmentBuyUseCase = listShipmentBuyUseCase
  }

  async handle (request: Request, response: Response): Promise<Response> {
    try {
      const userId = request.loggedId
      const { month } = request.query
      const { body, statusCode } = await this._listShipmentBuyUseCase.execute(userId, Number(month) - 1)
      return response.status(statusCode).json(body)
    } catch (error) {
      appLogger.logError({ error: error.message, path: request.path })
      return response.status(500).json({ error: 'Unexpected error' })
    }
  }
}
