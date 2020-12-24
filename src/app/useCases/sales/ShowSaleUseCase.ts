import { NotFoundError } from '@helpers/errors/notFoundError'
import { ServerError } from '@helpers/errors/serverError'
import { HttpResponse, IHttpResponse } from '@helpers/HttpResponse'
import { appLogger } from '@helpers/Logger'
import { ISalesRepository } from '@repositories/interfaces/ISalesRepository'

export class ShowSaleUseCase {
  private readonly _saleRepository: ISalesRepository

  constructor (saleRepository: ISalesRepository) {
    this._saleRepository = saleRepository
  }

  async execute (id: string): Promise<IHttpResponse> {
    try {
      const sale = await this._saleRepository.findById(id)
      if (!sale) {
        appLogger.logError({ error: `Sale not found by id ${id}` })
        return HttpResponse.notFound(new NotFoundError('Sale'))
      }

      return HttpResponse.ok(sale)
    } catch (error) {
      appLogger.logError({ error: error.message, filename: __filename })
      return HttpResponse.serverError(new ServerError())
    }
  }
}
