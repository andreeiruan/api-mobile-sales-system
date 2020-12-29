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

      if (sales.length > 0) {
        const amountSale = sales.map(s => s.saleTotal).reduce((s, n) => s + n)

        const daysSales = sales.map(s => s.createdAt).map(d => d.getDate())
        const listDays = daysSales.filter((d, i) => daysSales.indexOf(d) === i)

        const salesPerDay = {}

        listDays.forEach(d => {
          salesPerDay[d] = sales.filter(s => s.createdAt.getDate() === d)
        })

        return HttpResponse.ok({ sales: salesPerDay, amountSale })
      }

      return HttpResponse.ok({ sales: [], amountSale: 0 })
    } catch (error) {
      appLogger.logError({ error: error.message, filename: __filename, params: { userId, month } })
      return HttpResponse.serverError(new ServerError())
    }
  }
}
