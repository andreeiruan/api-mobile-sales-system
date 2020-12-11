import { Product } from '@entities/Product'
import { Shipment } from '@entities/Shipment'
import { ShipmentProduct } from '@entities/ShipmentProduct'
import { appLogger } from '@helpers/Logger'
import { IShipmentAttributes, IShipmentRepository } from '@repositories/interfaces/IShipmentRepository'
import { getConnection, getRepository } from 'typeorm'

interface IPeriod{
  initial: Date
  end: Date
}

export class ShipmentRepostory implements IShipmentRepository {
  async create (data: IShipmentAttributes): Promise<Shipment> {
    const connection = getConnection()

    const queryRunner = connection.createQueryRunner()

    const { userId, amountValue, provider, products } = data

    try {
      await queryRunner.startTransaction()
      const shipment = queryRunner.manager.create(Shipment, { userId, amountValue, provider })
      await queryRunner.manager.save(shipment)

      for (const p of products) {
        const product = await queryRunner.manager.findOne(Product, { where: { id: p.id } })
        await queryRunner.manager.getRepository(Product)
          .createQueryBuilder('products')
          .update({ amount: product.amount + p.amount })
          .where('products.id = :id', { id: p.id })
          .useTransaction(true)
          .execute()

        await queryRunner.manager.getRepository(ShipmentProduct)
          .createQueryBuilder('shipmentsProducts')
          .insert()
          .into(ShipmentProduct)
          .values(
            {
              userId: userId,
              shipmentId: shipment.id,
              productId: p.id,
              unitaryValue: p.unitaryValue,
              amount: p.amount
            }
          )
          .useTransaction(true)
          .execute()
      }

      return shipment
    } catch (error) {
      await queryRunner.rollbackTransaction()
      appLogger.logError({ error: error.message, filename: __filename })
      throw new Error('Transaction of shipment has failed')
    } finally {
      await queryRunner.commitTransaction()
      await queryRunner.release()
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

  async listMonthByUserId (userId:string, month: number): Promise<Shipment[]> {
    const { initial, end } = this.getPeriod(month)

    const repository = getRepository(Shipment)

    const shipments = await repository.createQueryBuilder('shipments')
      .select()
      .where('shipments.userId = :id', { id: userId })
      .andWhere('shipments.createdAt >= :initial', { initial: initial })
      .andWhere('shipments.createdAt <= :end', { end: end })
      .execute()

    return shipments
  }

  async findById (id: string): Promise<Shipment> {
    const repository = getRepository(Shipment)

    const shipment = await repository.findOne({
      where: { id },
      join: { alias: 'shipments', innerJoinAndSelect: { sp: 'shipments.shipmentProducts' } }
    })

    return shipment
  }
}
