import { Router } from 'express'
import { appLogger } from '@helpers/Logger'
import { signInUseCase, signUpUseCase } from '@useCases/users'

const routerUser = Router()

routerUser.post('/signin', async (request, response) => {
  try {
    const { body, statusCode } = await signInUseCase.execute(request.body)
    if (statusCode === 401) {
      appLogger.logWarn({ ip: request.ip, body: request.body })
    }
    return response.status(statusCode).json(body)
  } catch (error) {
    appLogger.logError({ error: error.message, path: request.path })
    return response.status(500).json({ error: 'Unexpected error' })
  }
})

routerUser.post('/signup', async (request, response) => {
  try {
    const { name, email, password, confirmPassword } = request.body
    const { body, statusCode } = await signUpUseCase.execute({ name, email, password, confirmPassword })
    return response.status(statusCode).json(body)
  } catch (error) {
    appLogger.logError({ error: error.message, path: request.path })
    return response.status(500).json({ error: 'Unexpected error' })
  }
})
export { routerUser }
