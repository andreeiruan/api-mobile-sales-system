import { MissingParamError } from '@helpers/errors/missingParamError'
import { NotFoundError } from '@helpers/errors/notFoundError'
import { ServerError } from '@helpers/errors/serverError'
import { HttpResponse, IHttpResponse } from '@helpers/HttpResponse'
import { appLogger } from '@helpers/Logger'
import { ISalesAttributes, ISalesRepository, IProductSaleDTO } from '@repositories/interfaces/ISalesRepository'
import { IUserRepository } from '@repositories/interfaces/IUserRepository'

export class CreateSaleUseCase {
  private readonly _saleRepository: ISalesRepository
  private readonly _userRepository: IUserRepository

  constructor (saleRepository: ISalesRepository, userRepository: IUserRepository) {
    this._saleRepository = saleRepository
    this._userRepository = userRepository
  }

  private _valueProducts (product: IProductSaleDTO): number {
    const discount = product.unitaryDiscount || 0
    let result = product.unitaryValue - discount
    result *= product.amount
    return result
  }

  async execute (data: ISalesAttributes): Promise<IHttpResponse> {
    try {
      const { payDate, userId, products, discount, confirmPay, nameCliente, partialPayment, amountPaid, remainingAmount } = data
      if (!payDate) {
        return HttpResponse.badRequest(new MissingParamError('payDate'))
      }
      if (confirmPay === undefined) {
        return HttpResponse.badRequest(new MissingParamError('confirmPay'))
      }
      if (!nameCliente) {
        return HttpResponse.badRequest(new MissingParamError('nameCliente'))
      }

      if (partialPayment === undefined) {
        return HttpResponse.badRequest(new MissingParamError('partialPayment'))
      }

      if (!products || products.length === 0) {
        return HttpResponse.badRequest(new MissingParamError('Products'))
      }

      const userExists = await this._userRepository.findById(userId)
      if (!userExists) {
        appLogger.logError({ error: 'User not found by id', filename: __filename, id: userId })
        return HttpResponse.notFound(new NotFoundError('users'))
      }

      let saleTotal = products.map(this._valueProducts)
        .reduce((s, n) => s + n)

      saleTotal -= discount || 0

      const sale = await this._saleRepository.create({
        payDate,
        saleTotal,
        products,
        userId,
        discount,
        confirmPay,
        nameCliente,
        partialPayment,
        amountPaid,
        remainingAmount
      })

      return HttpResponse.created(sale)
    } catch (error) {
      appLogger.logError({ error: error.message, filename: __filename, params: { ...data } })
      return HttpResponse.serverError(new ServerError())
    }
  }
}
