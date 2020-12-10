import { Product } from '@entities/Product'
import { Shipment } from '@entities/Shipment'
import { ShipmentProduct } from '@entities/ShipmentProduct'
import { appLogger } from '@helpers/Logger'
import { IShipmentAttributes } from '@repositories/interfaces/IShipmentRepository'
import { getConnection } from 'typeorm'

export class ShipmentRepostory {
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
    }
  }
}
