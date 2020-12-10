import { SignInControllerExpress } from '@controllers/users/SignInControllerExpress'
import { signInUseCase, signUpUseCase } from '@useCases/users'
import { Router } from 'express'
import { SignUpUseControllerExpress } from '@controllers/users/SignUpControllerExpress'
import { CreateProductControllerExpress } from '@controllers/products/CreateProductControllerExpress'
import { createProductUseCase, listProductUseCase, showProductUseCase } from '@useCases/products'
import auth from '@middlewares/authentication'
import { ShipmentBuyControllerExpress } from '@controllers/shipment/shipmentBuyControllerExpress copy'
import { listShipmentUseCase, shipmentBuyUseCase, showShipmentUseCase } from '@useCases/shipment'
import { ListShipmentControllerExpress } from '@controllers/shipment/ListShipmentControllerExpress'
import { ShowShipmentControllerExpress } from '@controllers/shipment/ShowShipmentControllerExpress'
import { ShowProductControllerExpress } from '@controllers/products/ShowProductControllerExpress'
import { ListProductsControllerExpress } from '@controllers/products/ListProductsControllerExpress'
import { CreateSaleControllerExpress } from '@controllers/sales/CreateSaleControllerExpress'
import { createSaleUseCase } from '@useCases/sales'

export class AppRouter {
  public readonly routes: Router

  constructor () {
    this.routes = Router()
    this._routerUsers()
    this._routerProducts()
    this._routerShipment()
    this._routerSales()
  }

  private _routerUsers () {
    this.routes.post('/signup', (req, res) => new SignUpUseControllerExpress(signUpUseCase).handle(req, res))
    this.routes.post('/signin', (req, res) => new SignInControllerExpress(signInUseCase).handle(req, res))
  }

  private _routerProducts () {
    this.routes.post('/products', auth, (req, res) => new CreateProductControllerExpress(createProductUseCase).handle(req, res))
    this.routes.get('/products', auth, (req, res) => new ListProductsControllerExpress(listProductUseCase).handle(req, res))
    this.routes.get('/products/:id', auth, (req, res) => new ShowProductControllerExpress(showProductUseCase).handle(req, res))
  }

  private _routerShipment () {
    this.routes.post('/shipments', auth, (req, res) => new ShipmentBuyControllerExpress(shipmentBuyUseCase).handle(req, res))
    this.routes.get('/shipments', auth, (req, res) => new ListShipmentControllerExpress(listShipmentUseCase).handle(req, res))
    this.routes.get('/shipments/:id', auth, (req, res) => new ShowShipmentControllerExpress(showShipmentUseCase).handle(req, res))
  }

  private _routerSales () {
    this.routes.post('/sales', auth, (req, res) => new CreateSaleControllerExpress(createSaleUseCase).handle(req, res))
  }
}
