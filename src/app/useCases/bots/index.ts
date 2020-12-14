import { BotHistoryRepository } from '@repositories/implementations/BotHistoryRepository'
import { BotUseCase } from './botUseCase'

const botHistoryRepository = new BotHistoryRepository()

const botUseCase = new BotUseCase(botHistoryRepository)

export { botUseCase }
