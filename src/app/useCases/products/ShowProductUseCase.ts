import { NotFoundError } from '@helpers/errors/notFoundError'
import { ServerError } from '@helpers/errors/serverError'
import { HttpResponse, IHttpResponse } from '@helpers/HttpResponse'
import { appLogger } from '@helpers/Logger'
import { IProductRepository } from '@repositories/interfaces/IProductRepository'

export class ShowProductUseCase {
  private _productRepository: IProductRepository

  constructor (productRepository: IProductRepository) {
    this._productRepository = productRepository
  }

  async execute (id: string): Promise<IHttpResponse> {
    try {
      const product = await this._productRepository.findById(id)
      if (!product) {
        appLogger.logError({ error: `Product not found by id ${id}` })
        return HttpResponse.notFound(new NotFoundError('Product'))
      }

      return HttpResponse.ok(product)
    } catch (error) {
      appLogger.logError({ error: error.message, filename: __filename, params: { id } })
      return HttpResponse.serverError(new ServerError())
    }
  }
}
