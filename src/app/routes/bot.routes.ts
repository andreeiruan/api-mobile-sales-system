import { appLogger } from '@helpers/Logger'
import { Queue } from '@providers/Queue'
import { botUseCase, listBotHistoryUseCase, showBotHistoryUseCase } from '@useCases/bots'
import { Request, Router } from 'express'
import auth from '../middlewares/authentication'

const routerBot = Router()

routerBot.post('/bot/invoke', auth, async (request: Request, response) => {
  try {
    const { product } = request.body
    const userId = request.loggedId
    const { body, statusCode } = await botUseCase.execute(userId, product)

    if (statusCode === 201) {
      await Queue.instance().add('BotJob', { product, historyId: body.id })
    }

    return response.status(statusCode).json(body)
  } catch (error) {
    appLogger.logError({ error: error.message, path: request.path })
    return response.status(500).json({ error: 'Unexpected error' })
  }
})

routerBot.get('/bot/history/:id', async (request, response) => {
  try {
    const { id } = request.params

    const { body, statusCode } = await showBotHistoryUseCase.execute(id, request.io)

    return response.status(statusCode).json(body)
  } catch (error) {
    appLogger.logError({ error: error.message, path: request.path })
    return response.status(500).json({ error: 'Unexpected error' })
  }
})

routerBot.get('/bot/history', auth, async (request, response) => {
  try {
    const { body, statusCode } = await listBotHistoryUseCase.execute(request.loggedId)

    return response.status(statusCode).json(body)
  } catch (error) {
    appLogger.logError({ error: error.message, path: request.path })
    return response.status(500).json({ error: 'Unexpected error' })
  }
})

export { routerBot }
