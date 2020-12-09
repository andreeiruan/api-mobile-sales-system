import { appLogger } from '@helpers/Logger'
import { ShipmentBuyUseCase } from '@useCases/shipmentBuy/ShipmentBuyUseCase'
import { Request, Response } from 'express'

export class ShipmentBuyControllerExpress {
  private readonly _shipmentBuyUseCase: ShipmentBuyUseCase
  constructor (shipmentBuyUseCase: ShipmentBuyUseCase) {
    this._shipmentBuyUseCase = shipmentBuyUseCase
  }

  async handle (request: Request, response: Response): Promise<Response> {
    try {
      const { products, provider } = request.body
      const userId = request.loggedId
      const { body, statusCode } = await this._shipmentBuyUseCase.execute({ products, userId, provider })
      return response.status(statusCode).json(body)
    } catch (error) {
      appLogger.logError({ error: error.message, path: request.path })
      return response.status(500).json({ error: 'Unexpected error' })
    }
  }
}
