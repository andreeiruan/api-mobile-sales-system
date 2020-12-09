import { appLogger } from '@helpers/Logger'
import { CreateProductUseCase } from '@useCases/products/CreateProductUseCase'
import { Request, Response } from 'express'

export class CreateProductControllerExpress {
  private readonly _createProductUseCase: CreateProductUseCase
  constructor (createProductUseCase: CreateProductUseCase) {
    this._createProductUseCase = createProductUseCase
  }

  async handle (request: Request, response: Response): Promise<Response> {
    try {
      const { body, statusCode } = await this._createProductUseCase.execute(request.loggedId, request.body)
      return response.status(statusCode).json(body)
    } catch (error) {
      appLogger.logError({ error: error.message, path: request.path })
      return response.status(500).json({ error: 'Unexpected error' })
    }
  }
}
