import { appLogger } from '@helpers/Logger'
import { listShipmentUseCase, shipmentBuyUseCase, showShipmentUseCase } from '@useCases/shipment'
import { Router } from 'express'
import auth from '../middlewares/authentication'

const routerShipment = Router()

routerShipment.post('/shipments', auth, async (request, response) => {
  try {
    const { products, provider } = request.body
    const userId = request.loggedId
    const { body, statusCode } = await shipmentBuyUseCase.execute({ products, userId, provider })
    return response.status(statusCode).json(body)
  } catch (error) {
    appLogger.logError({ error: error.message, path: request.path })
    return response.status(500).json({ error: 'Unexpected error' })
  }
})

routerShipment.get('/shipments', auth, async (request, response) => {
  try {
    const userId = request.loggedId
    const { month, year } = request.query
    const { body, statusCode } = await listShipmentUseCase.execute(userId, Number(month) - 1, Number(year))
    return response.status(statusCode).json(body)
  } catch (error) {
    appLogger.logError({ error: error.message, path: request.path })
    return response.status(500).json({ error: 'Unexpected error' })
  }
})

routerShipment.get('/shipments/:id', auth, async (request, response) => {
  try {
    const { id } = request.params
    const { body, statusCode } = await showShipmentUseCase.execute(id)
    return response.status(statusCode).json(body)
  } catch (error) {
    appLogger.logError({ error: error.message, path: request.path })
    return response.status(500).json({ error: 'Unexpected error' })
  }
})

export { routerShipment }
