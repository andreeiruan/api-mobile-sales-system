import { Product } from '@entities/Product'
import { IProductAttributes, IProductRepository } from '@repositories/interfaces/IProductRepository'
import { getRepository } from 'typeorm'

export class ProductRepository implements IProductRepository {
  async create (data: IProductAttributes): Promise<Product> {
    const repository = getRepository(Product)

    const product = repository.create(data)
    await repository.save(product)

    return product
  }

  async findByUserIdAndName (userId: string, name: string): Promise<Product> {
    const repository = getRepository(Product)

    const productExists = await repository.findOne({ where: [{ userId: userId }, { name: name }] })

    return productExists
  }
}
