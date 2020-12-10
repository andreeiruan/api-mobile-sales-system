import { ShipmentRepostory } from '@repositories/implementations/ShipmentRepository'
import { UserRepository } from '@repositories/implementations/UserRepository'
import { ShipmentBuyUseCase } from './ShipmentBuyUseCase'

const userRepository = new UserRepository()
const shipmentRepository = new ShipmentRepostory()

const shipmentBuyUseCase = new ShipmentBuyUseCase(userRepository, shipmentRepository)

export { shipmentBuyUseCase }
