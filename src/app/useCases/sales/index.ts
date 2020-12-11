import { SaleRepository } from '@repositories/implementations/SaleRepository'
import { UserRepository } from '@repositories/implementations/UserRepository'
import { CreateSaleUseCase } from './CreateSaleUseCase'
import { ListSalesUseCase } from './ListSalesUseCase'
import { ShowSaleUseCase } from './ShowSaleUseCase'

const userRepository = new UserRepository()
const saleRepository = new SaleRepository()

const createSaleUseCase = new CreateSaleUseCase(saleRepository, userRepository)
const listSaleUseCase = new ListSalesUseCase(userRepository, saleRepository)
const showSaleUseCase = new ShowSaleUseCase(saleRepository)

export { createSaleUseCase, listSaleUseCase, showSaleUseCase }
