import { SaleRepository } from '@repositories/implementations/SaleRepository'
import { ShipmentRepostory } from '@repositories/implementations/ShipmentRepository'
import { MonthlyFinancialReportUseCase } from './MonthlyFinancialReportUseCase'

const shipmentRepository = new ShipmentRepostory()
const saleRepository = new SaleRepository()

const monthlyFinancialReportUseCase = new MonthlyFinancialReportUseCase(saleRepository, shipmentRepository)

export { monthlyFinancialReportUseCase }
