import { appLogger } from '@helpers/Logger'
import { Queue } from '@providers/Queue'
import { botUseCase } from '@useCases/bots'
import { Request, Router } from 'express'
import auth from '../middlewares/authentication'

const routerBot = Router()

routerBot.post('/botinvoke', auth, async (request: Request, response) => {
  try {
    const { product } = request.body
    const userId = request.loggedId
    const { body, statusCode } = await botUseCase.execute(userId)

    if (statusCode === 201) {
      await Queue.instance().add('BotJob', { product, historyId: body.id }, { attempts: 1, backoff: 3000, jobId: request.loggedId })
    }

    return response.status(statusCode).json(body)
  } catch (error) {
    appLogger.logError({ error: error.message, path: request.path })
    return response.status(500).json({ error: 'Unexpected error' })
  }
})

export { routerBot }
