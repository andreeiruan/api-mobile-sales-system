import { ProductRepository } from '@repositories/implementations/ProductRepository'
import { UserRepository } from '@repositories/implementations/UserRepository'
import { CreateProductUseCase } from './CreateProductUseCase'

const productRepository = new ProductRepository()
const userRepository = new UserRepository()

const createProductUseCase = new CreateProductUseCase(productRepository, userRepository)

export { createProductUseCase }
