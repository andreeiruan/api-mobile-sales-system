import { ServerError } from '@helpers/errors/serverError'
import { HttpResponse, IHttpResponse } from '@helpers/HttpResponse'
import { appLogger } from '@helpers/Logger'
import { IBotHistoryRepository } from '@repositories/interfaces/IBotHistoryRepository'
import { Server } from 'socket.io'

export class ShowBotHistoryUseCase {
  private readonly _botHistoryRepository: IBotHistoryRepository

  constructor (botHistoryRepository: IBotHistoryRepository) {
    this._botHistoryRepository = botHistoryRepository
  }

  async execute (historyId: string, socket: Server): Promise<IHttpResponse> {
    try {
      const botHistory = await this._botHistoryRepository.findById(historyId)

      socket.emit(`showBotHistory${historyId}`, botHistory)

      return HttpResponse.ok(botHistory)
    } catch (error) {
      appLogger.logError({ error: error.message, filename: __filename, params: { historyId } })
      return HttpResponse.serverError(new ServerError())
    }
  }
}
