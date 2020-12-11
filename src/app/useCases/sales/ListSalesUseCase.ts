import { NotFoundError } from '@helpers/errors/notFoundError'
import { ServerError } from '@helpers/errors/serverError'
import { HttpResponse, IHttpResponse } from '@helpers/HttpResponse'
import { appLogger } from '@helpers/Logger'
import { ISalesRepository } from '@repositories/interfaces/ISalesRepository'
import { IUserRepository } from '@repositories/interfaces/IUserRepository'

export class ListSalesUseCase {
  private readonly _userRepository: IUserRepository
  private readonly _saleRepository: ISalesRepository

  constructor (userRepository: IUserRepository, saleRepository: ISalesRepository) {
    this._userRepository = userRepository
    this._saleRepository = saleRepository
  }

  async execute (userId: string, month: number): Promise<IHttpResponse> {
    try {
      const userExists = await this._userRepository.findById(userId)
      if (!userExists) {
        appLogger.logError({ error: `User not foud by id ${userId}` })
        return HttpResponse.notFound(new NotFoundError('User'))
      }

      const sales = await this._saleRepository.listMonthByUserId(userId, month)
      return HttpResponse.ok(sales)
    } catch (error) {
      appLogger.logError({ error: error.message, filename: __filename, params: { userId, month } })
      return HttpResponse.serverError(new ServerError())
    }
  }
}
