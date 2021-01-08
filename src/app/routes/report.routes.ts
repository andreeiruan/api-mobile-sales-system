import { appLogger } from '@helpers/Logger'
import { monthlyFinancialReportUseCase } from '@useCases/reports'

import { Router } from 'express'
import auth from '../middlewares/authentication'

const routerReport = Router()

routerReport.get('/report/financial/simple', auth, async (request, response) => {
  try {
    const userId = request.loggedId
    const { month, year } = request.query
    const { body, statusCode } = await monthlyFinancialReportUseCase.execute(userId, Number(month) - 1, Number(year))
    return response.status(statusCode).json(body)
  } catch (error) {
    appLogger.logError({ error: error.message, path: request.path })
    return response.status(500).json({ error: 'Unexpected error' })
  }
})

export { routerReport }
