import { ServerError } from '@helpers/errors/serverError'
import { HttpResponse, IHttpResponse } from '@helpers/HttpResponse'
import { appLogger } from '@helpers/Logger'
import { ISalesRepository } from '@repositories/interfaces/ISalesRepository'
import { IShipmentRepository } from '@repositories/interfaces/IShipmentRepository'

export class MonthlyFinancialReportUseCase {
  private readonly _salesRepository: ISalesRepository
  private readonly _shipmentsRepository: IShipmentRepository

  constructor (salesRepository: ISalesRepository, shipmentsRepository: IShipmentRepository) {
    this._salesRepository = salesRepository
    this._shipmentsRepository = shipmentsRepository
  }

  async execute (userId: string, month: number, year: number): Promise<IHttpResponse> {
    try {
      const reportSaleMonth = await this._salesRepository.getValueSoldMonth(userId, month, year)
      const reportPurchasesMonth = await this._shipmentsRepository.getValuePurchasesMonth(userId, month, year)

      const balanceAmount = reportSaleMonth.amountValue - reportPurchasesMonth.amountValue
      const percentage = Number(Number(100 * balanceAmount / reportSaleMonth.amountValue).toFixed(2))

      const balance = {
        balanceAmount,
        balancePercentage: balanceAmount < 0 ? percentage * 2 - percentage : percentage
      }

      return HttpResponse.ok({ reportSaleMonth, reportPurchasesMonth, balance })
    } catch (error) {
      appLogger.logError({ error: error.message, filename: __filename })
      return HttpResponse.serverError(new ServerError())
    }
  }
}
