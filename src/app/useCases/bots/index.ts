import { BotHistoryRepository } from '@repositories/implementations/BotHistoryRepository'
import { BotUseCase } from './botUseCase'
import { ShowBotHistoryUseCase } from './ShowBotHistoryUseCase'
import { ListBotHistoryUseCase } from './ListBotHistoryUseCase'

const botHistoryRepository = new BotHistoryRepository()

const botUseCase = new BotUseCase(botHistoryRepository)
const showBotHistoryUseCase = new ShowBotHistoryUseCase(botHistoryRepository)
const listBotHistoryUseCase = new ListBotHistoryUseCase(botHistoryRepository)

export { botUseCase, showBotHistoryUseCase, listBotHistoryUseCase }
