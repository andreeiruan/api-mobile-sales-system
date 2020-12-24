import { Product } from '@entities/Product'
import { IProductAttributes, IProductRepository } from '@repositories/interfaces/IProductRepository'
import { getRepository, ILike } from 'typeorm'

export class ProductRepository implements IProductRepository {
  async create (data: IProductAttributes): Promise<Product> {
    const repository = getRepository(Product)

    const product = repository.create(data)
    await repository.save(product)

    return product
  }

  async findByUserIdAndName (userId: string, name: string): Promise<Product> {
    const repository = getRepository(Product)

    const productExists = await repository.findOne({ where: { userId: userId, name: name ? ILike(`%${name}%`) : ILike('%%') } })

    return productExists
  }

  async listProducts (userId:string, name?: string): Promise<Product[]> {
    const repository = getRepository(Product)

    if (name) {
      const products = await repository.find({ where: { userId, name: ILike(`%${name}%`) } })

      return products
    }

    const products = await repository.find({ where: { userId } })
    return products
  }

  async findById (id: string): Promise<Product> {
    const repository = getRepository(Product)

    const product = await repository.findOne({ where: { id } })

    return product
  }
}
