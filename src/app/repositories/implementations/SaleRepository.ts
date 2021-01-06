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
    const {
      userId, payDate, products, saleTotal, discount,
      confirmPay, nameCliente, partialPayment, amountPaid, remainingAmount
    } = data

    try {
      await queryRunner.startTransaction()

      const sumDiscount = products.map(p => p.unitaryDiscount).reduce((s, n) => s + n)
      const sale = queryRunner.manager.create(Sale, {
        payDate,
        saleTotal,
        discount: discount || 0 + sumDiscount,
        userId,
        confirmPay,
        nameCliente,
        partialPayment,
        amountPaid,
        remainingAmount
      })
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
      throw new Error('Transaction of sale has failed')
    } finally {
      await queryRunner.commitTransaction()
      await queryRunner.release()
    }
  }

  private getPeriod (m: number, year: number): IPeriod {
    let date: any = new Date().setMonth(m)
    date = new Date(date).setFullYear(year)
    date = new Date(date)

    const initial = new Date(date.getFullYear(), date.getMonth(), 1)
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0)

    return {
      initial,
      end
    }
  }

  async listMonthByUserId (userId:string, month?: number, year?: number): Promise<Sale[]> {
    const repository = getRepository(Sale)

    const { initial, end } = this.getPeriod(month, year)

    const sales = await repository.createQueryBuilder('sales')
      .select()
      .where('sales.userId = :id', { id: userId })
      .andWhere('sales.createdAt >= :initial', { initial: initial })
      .andWhere('sales.createdAt <= :end', { end: end })
      .execute()

    const salesData = sales.map((d: any) => ({
      confirmPay: d.sales_confirmPay,
      createdAt: d.sales_createdAt,
      discount: d.sales_discount,
      id: d.sales_id,
      nameCliente: d.sales_nameCliente,
      payDate: d.sales_payDate,
      saleTotal: d.sales_saleTotal,
      updatedAt: d.sales_updatedAt,
      userId: d.sales_userId,
      partialPayment: d.sales_partialPayment,
      amountPaid: d.sales_amountPaid,
      remainingAmount: d.sales_remainingAmount
    }))

    return salesData
  }

  async findById (id: string): Promise<Sale> {
    const repository = getRepository(Sale)

    const sale = await repository.findOne({
      where: { id },
      join: { alias: 'sales', innerJoinAndSelect: { sp: 'sales.salesProducts' } }
    })

    return sale
  }
}
