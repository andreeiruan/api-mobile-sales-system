import { appLogger } from '@helpers/Logger'
import { createProductUseCase, listProductUseCase, showProductUseCase, updateProductUseCase } from '@useCases/products'
import { Router } from 'express'
import auth from '../middlewares/authentication'

const routerProducts = Router()

routerProducts.post('/products', auth, async (request, response) => {
  try {
    const { body, statusCode } = await createProductUseCase.execute(request.loggedId, request.body)
    return response.status(statusCode).json(body)
  } catch (error) {
    appLogger.logError({ error: error.message, path: request.path })
    return response.status(500).json({ error: 'Unexpected error' })
  }
})

routerProducts.get('/products', auth, async (request, response) => {
  try {
    const userId = request.loggedId
    const { name } = request.query

    // @ts-ignore
    const { body, statusCode } = await listProductUseCase.execute(userId, name)
    return response.status(statusCode).json(body)
  } catch (error) {
    appLogger.logError({ error: error.message, path: request.path })
    return response.status(500).json({ error: 'Unexpected error' })
  }
})

routerProducts.get('/products/:id', auth, async (request, response) => {
  try {
    const { id } = request.params

    const { body, statusCode } = await showProductUseCase.execute(id)
    return response.status(statusCode).json(body)
  } catch (error) {
    appLogger.logError({ error: error.message, path: request.path })
    return response.status(500).json({ error: 'Unexpected error' })
  }
})

routerProducts.patch('/products/:id', auth, async (request, response) => {
  try {
    const { id } = request.params
    const { name, saleValue } = request.body

    const { body, statusCode } = await updateProductUseCase.execute({ id, name, saleValue })
    return response.status(statusCode).json(body)
  } catch (error) {
    appLogger.logError({ error: error.message, path: request.path })
    return response.status(500).json({ error: 'Unexpected error' })
  }
})

export { routerProducts }
