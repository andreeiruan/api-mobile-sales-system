import { Product } from '@entities/Product'
import { Sale } from '@entities/Sale'
import { SalesProducts } from '@entities/SaleProducts'
import { appLogger } from '@helpers/Logger'
import { ISalesAttributes, ISalesRepository } from '@repositories/interfaces/ISalesRepository'
import { getConnection, getRepository } from 'typeorm'

interface IPeriod{
  initial: Date
  end: Date
}

export class SaleRepository implements ISalesRepository {
  async create (data: ISalesAttributes): Promise<Sale> {
    const connection = getConnection()

    const queryRunner = connection.createQueryRunner()

    const { userId, payDate, products, saleTotal, discount, confirmPay, nameCliente } = data
    try {
      await queryRunner.startTransaction()

      const sumDiscount = products.map(p => p.unitaryDiscount).reduce((s, n) => s + n)
      const sale = queryRunner.manager.create(Sale, { payDate, saleTotal, discount: discount || 0 + sumDiscount, userId, confirmPay, nameCliente })
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

  private getPeriod (m: number): IPeriod {
    let date: any = new Date().setMonth(m)
    date = new Date(date)
    const initial = new Date(date.getFullYear(), date.getMonth(), 1)
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0)

    return {
      initial,
      end
    }
  }

  async listMonthByUserId (userId:string, month?: number): Promise<Sale[]> {
    const repository = getRepository(Sale)

    const { initial, end } = this.getPeriod(month)

    const sales = await repository.createQueryBuilder('sales')
      .select()
      .where('sales.userId = :id', { id: userId })
      .andWhere('sales.createdAt >= :initial', { initial: initial })
      .andWhere('sales.createdAt <= :end', { end: end })
      .execute()

    return sales
  }
}
