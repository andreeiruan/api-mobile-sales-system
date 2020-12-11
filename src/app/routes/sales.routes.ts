import { appLogger } from '@helpers/Logger'
import { createSaleUseCase, listSaleUseCase } from '@useCases/sales'
import { Router } from 'express'
import auth from '../middlewares/authentication'

const routerSales = Router()

routerSales.post('/sales', auth, async (request, response) => {
  try {
    const { products, payDate, discount, confirmPay, nameCliente } = request.body
    const userId = request.loggedId
    const { body, statusCode } = await createSaleUseCase.execute({ payDate, products, userId, discount, confirmPay, nameCliente })
    return response.status(statusCode).json(body)
  } catch (error) {
    appLogger.logError({ error: error.message, path: request.path })
    return response.status(500).json({ error: 'Unexpected error' })
  }
})
routerSales.get('/sales', auth, async (request, response) => {
  try {
    const userId = request.loggedId
    const { month } = request.query
    const { statusCode, body } = await listSaleUseCase.execute(userId, Number(month) - 1)
    return response.status(statusCode).json(body)
  } catch (error) {
    appLogger.logError({ error: error.message, path: request.path })
    return response.status(500).json({ error: 'Unexpected error' })
  }
})
export { routerSales }
