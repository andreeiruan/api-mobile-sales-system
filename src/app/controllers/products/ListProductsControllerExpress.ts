import { appLogger } from '@helpers/Logger'
import { ListProductsUseCase } from '@useCases/products/ListProductsUseCase'
import { Request, Response } from 'express'

export class ListProductsControllerExpress {
  private readonly _listProductsUseCase: ListProductsUseCase

  constructor (listProductsUseCase: ListProductsUseCase) {
    this._listProductsUseCase = listProductsUseCase
  }

  async handle (request: Request, response: Response): Promise<Response> {
    try {
      const userId = request.loggedId
      const { name } = request.query

      const { body, statusCode } = await this._listProductsUseCase.execute(userId, `${name}`)
      return response.status(statusCode).json(body)
    } catch (error) {
      appLogger.logError({ error: error.message, path: request.path })
      return response.status(500).json({ error: 'Unexpected error' })
    }
  }
}
