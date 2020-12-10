import { Product } from '@entities/Product'
import { Sale } from '@entities/Sale'
import { SalesProducts } from '@entities/SaleProducts'
import { appLogger } from '@helpers/Logger'
import { ISalesAttributes, ISalesRepository } from '@repositories/interfaces/ISalesRepository'
import { getConnection } from 'typeorm'

export class SaleRepository implements ISalesRepository {
  async create (data: ISalesAttributes): Promise<Sale> {
    const connection = getConnection()

    const queryRunner = connection.createQueryRunner()

    const { userId, payDate, products, saleTotal, discount } = data
    try {
      await queryRunner.startTransaction()
      const sale = queryRunner.manager.create(Sale, { payDate, saleTotal, discount: discount || 0, userId })
      await queryRunner.manager.save(sale)

      for (const p of products) {
        const product = await queryRunner.manager.findOne(Product, { where: { id: p.id } })
        await queryRunner.manager.getRepository(Product)
          .createQueryBuilder('products')
          .update({ amount: product.amount - p.amount })
          .where('products.id = :id', { id: p.id })
          .useTransaction(true)
          .execute()

        await queryRunner.manager.getRepository(SalesProducts)
          .createQueryBuilder('salesProducts')
          .insert()
          .into(SalesProducts)
          .values({
            unitaryValue: p.unitaryValue,
            amount: p.amount,
            discountUnitary: p.unitaryDiscount || 0,
            productId: p.id,
            userId: userId,
            saleId: sale.id
          })
          .useTransaction(true)
          .execute()
      }

      return sale
    } catch (error) {
      await queryRunner.rollbackTransaction()
      appLogger.logError({ error: error.message, filename: __filename })
      throw new Error('Transaction of shipment has failed')
    } finally {
      await queryRunner.commitTransaction()
    }
  }
}
