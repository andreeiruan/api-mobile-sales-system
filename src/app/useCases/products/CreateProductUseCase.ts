import { MissingParamError } from '@helpers/errors/missingParamError'
import { NotFoundError } from '@helpers/errors/notFoundError'
import { ServerError } from '@helpers/errors/serverError'
import { IHttpResponse, HttpResponse } from '@helpers/HttpResponse'
import { appLogger } from '@helpers/Logger'
import { IProductAttributes, IProductRepository } from '@repositories/interfaces/IProductRepository'
import { IUserRepository } from '@repositories/interfaces/IUserRepository'

export class CreateProductUseCase {
  private readonly _productRepository: IProductRepository
  private readonly _userRepository: IUserRepository

  constructor (productRepository: IProductRepository, userRepository: IUserRepository) {
    this._productRepository = productRepository
    this._userRepository = userRepository
  }

  async execute (userId: string, data: IProductAttributes): Promise<IHttpResponse> {
    try {
      const { name, brand, saleValue } = data

      if (!name) {
        return HttpResponse.badRequest(new MissingParamError('name'))
      }

      if (!saleValue) {
        return HttpResponse.badRequest(new MissingParamError('saleValue'))
      }

      const userExists = await this._userRepository.findById(userId)
      if (!userExists) {
        appLogger.logError({ error: 'User not found by id on create product', id: userId })
        return HttpResponse.notFound(new NotFoundError('users'))
      }
      const productExists = await this._productRepository.findByUserIdAndName(userId, name)
      if (!productExists) {
        const productDTO = {
          userId,
          name,
          brand,
          saleValue,
          amount: 0
        }

        const product = await this._productRepository.create(productDTO)

        return HttpResponse.created(product)
      }

      return HttpResponse.noContent()
    } catch (error) {
      appLogger.logError({ error: error.message, filename: __filename })
      return HttpResponse.serverError(new ServerError())
    }
  }
}
