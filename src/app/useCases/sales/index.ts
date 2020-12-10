import { SaleRepository } from '@repositories/implementations/SaleRepository'
import { UserRepository } from '@repositories/implementations/UserRepository'
import { CreateSaleUseCase } from './CreateSaleUseCase'

const userRepository = new UserRepository()
const saleRepository = new SaleRepository()

const createSaleUseCase = new CreateSaleUseCase(saleRepository, userRepository)

export { createSaleUseCase }
