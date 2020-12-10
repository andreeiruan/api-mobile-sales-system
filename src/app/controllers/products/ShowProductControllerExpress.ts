import { appLogger } from '@helpers/Logger'
import { ShowProductUseCase } from '@useCases/products/ShowProductUseCase'
import { Request, Response } from 'express'

export class ShowProductControllerExpress {
  private readonly _showProductUseCase: ShowProductUseCase

  constructor (showProductUseCase: ShowProductUseCase) {
    this._showProductUseCase = showProductUseCase
  }

  async handle (request: Request, response: Response): Promise<Response> {
    try {
      const { id } = request.params

      const { body, statusCode } = await this._showProductUseCase.execute(id)
      return response.status(statusCode).json(body)
    } catch (error) {
      appLogger.logError({ error: error.message, path: request.path })
      return response.status(500).json({ error: 'Unexpected error' })
    }
  }
}
