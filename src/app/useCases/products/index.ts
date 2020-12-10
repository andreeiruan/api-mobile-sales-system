import { ProductRepository } from '@repositories/implementations/ProductRepository'
import { UserRepository } from '@repositories/implementations/UserRepository'
import { CreateProductUseCase } from './CreateProductUseCase'
import { ListProductsUseCase } from './ListProductsUseCase'

const productRepository = new ProductRepository()
const userRepository = new UserRepository()

const createProductUseCase = new CreateProductUseCase(productRepository, userRepository)
const listProductUseCase = new ListProductsUseCase(userRepository, productRepository)

export { createProductUseCase, listProductUseCase }
