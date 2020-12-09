import { Product } from '@entities/Product'
import { Shipment } from '@entities/Shipment'
import { ShipmentProduct } from '@entities/ShipmentProduct'
import { IShipmentAttributes } from '@repositories/interfaces/IShipmentRepository'
import { getRepository, getConnection } from 'typeorm'

export class ShipmentRepostory {
  async create (data: IShipmentAttributes): Promise<Shipment> {
    const connection = getConnection()
    const queryRunner = connection.createQueryRunner()

    const { userId, amountValue, provider, products } = data

    try {
      await queryRunner.startTransaction()

      const shipmentRepository = getRepository(Shipment)
      const shipment = shipmentRepository.create({ userId, amountValue, provider })
      await shipmentRepository.save(shipment)

      const shipmentsProductsRepository = getRepository(ShipmentProduct)
      const productRepository = getRepository(Product)

      products.forEach(async p => {
        const product = await productRepository.findOne({ where: { id: p.id } })
        await productRepository.update(p.id, { amount: product.amount + p.amount })
        const s = shipmentsProductsRepository.create({
          shipmentId: shipment.id,
          userId,
          productId: p.id,
          unitaryValue: p.unitaryValue,
          amount: p.amount
        })

        await shipmentsProductsRepository.save(s)
      })

      await queryRunner.commitTransaction()

      return shipment
    } catch (error) {
      await queryRunner.rollbackTransaction()
    }
  }
}
