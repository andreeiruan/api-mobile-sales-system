import { BotHistory } from '@entities/BotHistory'
import { ProductsBotHistory } from '@entities/ProductsBotHistory'
import { appLogger } from '@helpers/Logger'
import { IBotHistoryAttributes, IBotHistoryRepository, IProductBotHistoryDTO } from '@repositories/interfaces/IBotHistory'
import { getConnection, getRepository } from 'typeorm'

export class BotHistoryRepository implements IBotHistoryRepository {
  async create (data: IBotHistoryAttributes): Promise<BotHistory> {
    const { userId } = data

    const connection = getConnection()

    const queryRunner = connection.createQueryRunner()

    try {
      await queryRunner.startTransaction()

      const botHistory = queryRunner.manager.create(BotHistory, { userId })
      await queryRunner.manager.save(botHistory)

      return botHistory
    } catch (error) {
      await queryRunner.rollbackTransaction()
      appLogger.logError({ error: error.message, filename: __filename })
      throw new Error('Transaction of botHistory has failed')
    } finally {
      await queryRunner.commitTransaction()
      await queryRunner.release()
    }
  }

  async createProducts (products: IProductBotHistoryDTO[], historyId: string): Promise<BotHistory> {
    const connection = getConnection()

    const queryRunner = connection.createQueryRunner()

    try {
      await queryRunner.startTransaction()
      for (const p of products) {
        console.log(p)
        await queryRunner.manager.getRepository(ProductsBotHistory)
          .createQueryBuilder('productsBotHistory')
          .insert()
          .into(ProductsBotHistory)
          .values({
            name: p.name,
            price: p.price,
            freight: p.freight || '',
            parceledOut: p.parceledOut,
            link: p.link,
            historyId: historyId
          })
          .useTransaction(true)
          .execute()
      }

      const repository = getRepository(BotHistory)
      const botHistory = await repository.findOne({ where: { id: historyId } })
      return botHistory
    } catch (error) {
      console.log(error)
      await queryRunner.rollbackTransaction()
      appLogger.logError({ error: error.message, filename: __filename })
      throw new Error('Transaction of productsBotHistory has failed')
    } finally {
      await queryRunner.commitTransaction()
      await queryRunner.release()
    }
  }
}
