import { ShipmentRepostory } from '@repositories/implementations/ShipmentRepository'
import { UserRepository } from '@repositories/implementations/UserRepository'
import { ListShipmentsUseCase } from './ListShipmentsUseCase'
import { ShipmentBuyUseCase } from './ShipmentBuyUseCase'

const userRepository = new UserRepository()
const shipmentRepository = new ShipmentRepostory()

const shipmentBuyUseCase = new ShipmentBuyUseCase(userRepository, shipmentRepository)
const listShipmentUseCase = new ListShipmentsUseCase(userRepository, shipmentRepository)

export { shipmentBuyUseCase, listShipmentUseCase }
