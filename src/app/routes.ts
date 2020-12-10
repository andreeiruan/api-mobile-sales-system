import { SignInControllerExpress } from '@controllers/users/SignInControllerExpress'
import { signInUseCase, signUpUseCase } from '@useCases/users'
import { Router } from 'express'
import { SignUpUseControllerExpress } from '@controllers/users/SignUpControllerExpress'
import { CreateProductControllerExpress } from '@controllers/products/CreateProductControllerExpress'
import { createProductUseCase, listProductUseCase } from '@useCases/products'
import auth from '@middlewares/authentication'
import { ShipmentBuyControllerExpress } from '@controllers/shipment/shipmentBuyControllerExpress'
import { listShipmentUseCase, shipmentBuyUseCase } from '@useCases/shipment'
import { ListProductsControllerExpress } from '@controllers/products/ListProductsControllerExpress'
import { ListShipmentControllerExpress } from '@controllers/shipment/ListShipmentControllerExpress'

export class AppRouter {
  public readonly routes: Router

  constructor () {
    this.routes = Router()
    this._routerUsers()
    this._routerProducts()
    this._routerShipment()
  }

  private _routerUsers () {
    this.routes.post('/signup', (req, res) => new SignUpUseControllerExpress(signUpUseCase).handle(req, res))
    this.routes.post('/signin', (req, res) => new SignInControllerExpress(signInUseCase).handle(req, res))
  }

  private _routerProducts () {
    this.routes.post('/products', auth, (req, res) => new CreateProductControllerExpress(createProductUseCase).handle(req, res))
    this.routes.get('/products', auth, (req, res) => new ListProductsControllerExpress(listProductUseCase).handle(req, res))
  }

  private _routerShipment () {
    this.routes.post('/shipments', auth, (req, res) => new ShipmentBuyControllerExpress(shipmentBuyUseCase).handle(req, res))
    this.routes.get('/shipments', auth, (req, res) => new ListShipmentControllerExpress(listShipmentUseCase).handle(req, res))
  }
}
