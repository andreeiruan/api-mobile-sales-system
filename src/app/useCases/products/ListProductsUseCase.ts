import { NotFoundError } from '@helpers/errors/notFoundError'
import { ServerError } from '@helpers/errors/serverError'
import { HttpResponse, IHttpResponse } from '@helpers/HttpResponse'
import { appLogger } from '@helpers/Logger'
import { IProductRepository } from '@repositories/interfaces/IProductRepository'
import { IUserRepository } from '@repositories/interfaces/IUserRepository'

export class ListProductsUseCase {
  private readonly _userRepository: IUserRepository
  private readonly _productRepository: IProductRepository

  constructor (userRepository: IUserRepository, productRepository: IProductRepository) {
    this._userRepository = userRepository
    this._productRepository = productRepository
  }

  async execute (userId: string, nameProduct: string | undefined): Promise<IHttpResponse> {
    try {
      const userExists = await this._userRepository.findById(userId)
      if (!userExists) {
        appLogger.logError({ error: `User not found by id ${userId}`, filename: __filename })
        return HttpResponse.notFound(new NotFoundError('User'))
      }

      const products = await this._productRepository.listProducts(userId, nameProduct)

      return HttpResponse.ok(products)
    } catch (error) {
      appLogger.logError({ error: error.message, filename: __filename, params: { userId, nameProduct } })
      return HttpResponse.serverError(new ServerError())
    }
  }
}
