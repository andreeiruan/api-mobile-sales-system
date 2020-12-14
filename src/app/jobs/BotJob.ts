import axios from 'axios'
import { BotMercadoLivre } from '@app/bots'
import { BotHistoryRepository } from '@repositories/implementations/BotHistoryRepository'
import { JobProtocol } from './JobProtocol'
import 'reflect-metadata'
import '../../database/connect'

interface IBotJobDTO{
  data: {
    historyId: string,
    product: string
  }
}

const botJob: JobProtocol = {
  key: 'BotJob',
  async handle (data: IBotJobDTO): Promise<any> {
    const { historyId, product } = data.data

    const bot = new BotMercadoLivre({ headless: true, defaultViewport: { width: 1360, height: 720 }, args: ['--no-sandbox'] })
    const productsMercadoLivre = await bot.execute(product)

    let products = [...productsMercadoLivre]
    products = products.sort((a, b) => a.price - b.price).slice(0, 5)

    const botHistoryRepository = new BotHistoryRepository()
    const botHistoty = await botHistoryRepository.createProducts(products, historyId)

    await axios.get(`${process.env.API_URL}/api/bot/history/${botHistoty.id}`)
  }
}

export { botJob }
