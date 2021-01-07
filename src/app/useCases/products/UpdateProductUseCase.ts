import { MissingParamError } from '@helpers/errors/missingParamError'
import { NotFoundError } from '@helpers/errors/notFoundError'
import { ServerError } from '@helpers/errors/serverError'
import { IHttpResponse, HttpResponse } from '@helpers/HttpResponse'
import { appLogger } from '@helpers/Logger'
import { IProductRepository, UpdateProductDTO } from '@repositories/interfaces/IProductRepository'

export class UpdateProductUseCase {
  private readonly _productRepository: IProductRepository

  constructor (productRepository: IProductRepository) {
    this._productRepository = productRepository
  }

  async execute (data: UpdateProductDTO): Promise<IHttpResponse> {
    try {
      const { name, saleValue, id } = data

      if (!name && !saleValue) {
        return HttpResponse.badRequest(new MissingParamError('name or saleValue'))
      }

      const product = await this._productRepository.updateProduct({ id, name, saleValue })
      if (!product) {
        return HttpResponse.notFound(new NotFoundError('Product'))
      }

      return HttpResponse.updated(product)
    } catch (error) {
      appLogger.logError({ error: error.message, filename: __filename })
      return HttpResponse.serverError(new ServerError())
    }
  }
}
