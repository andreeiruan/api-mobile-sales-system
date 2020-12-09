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
      const { name, brand, value, amount } = data

      if (!name) {
        return HttpResponse.badRequest(new MissingParamError('name'))
      }

      if (!value) {
        return HttpResponse.badRequest(new MissingParamError('value'))
      }

      if (!amount) {
        return HttpResponse.badRequest(new MissingParamError('amount'))
      }

      const userExists = await this._userRepository.findById(userId)
      if (!userExists) {
        appLogger.logError({ error: 'User not found by id on create product', id: userId })
        return HttpResponse.notFound(new NotFoundError('users'))
      }

      const productDTO = {
        userId,
        name,
        brand,
        value,
        amount
      }

      const product = await this._productRepository.create(productDTO)

      return HttpResponse.created(product)
    } catch (error) {
      appLogger.logError({ error: error.message, filename: __filename })
      return HttpResponse.serverError(new ServerError())
    }
  }
}
