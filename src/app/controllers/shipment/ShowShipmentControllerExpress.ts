import { appLogger } from '@helpers/Logger'
import { ShowShipmentUseCase } from '@useCases/shipment/ShowShipmentUseCase'
import { Request, Response } from 'express'

export class ShowShipmentControllerExpress {
  private readonly _showShipmentUseCase: ShowShipmentUseCase
  constructor (showShipmentUseCase: ShowShipmentUseCase) {
    this._showShipmentUseCase = showShipmentUseCase
  }

  async handle (request: Request, response: Response): Promise<Response> {
    try {
      const { id } = request.params
      const { body, statusCode } = await this._showShipmentUseCase.execute(id)
      return response.status(statusCode).json(body)
    } catch (error) {
      appLogger.logError({ error: error.message, path: request.path })
      return response.status(500).json({ error: 'Unexpected error' })
    }
  }
}
