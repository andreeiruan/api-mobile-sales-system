import { appLogger } from '@helpers/Logger'
import { CreateSaleUseCase } from '@useCases/sales/CreateSaleUseCase'
import { Request, Response } from 'express'

export class CreateSaleControllerExpress {
  private readonly _createSaleUseCase: CreateSaleUseCase
  constructor (createSaleUseCase: CreateSaleUseCase) {
    this._createSaleUseCase = createSaleUseCase
  }

  async handle (request: Request, response: Response): Promise<Response> {
    try {
      const { products, payDate, discount } = request.body
      const userId = request.loggedId
      const { body, statusCode } = await this._createSaleUseCase.execute({ payDate, products, userId, discount })
      return response.status(statusCode).json(body)
    } catch (error) {
      appLogger.logError({ error: error.message, path: request.path })
      return response.status(500).json({ error: 'Unexpected error' })
    }
  }
}
