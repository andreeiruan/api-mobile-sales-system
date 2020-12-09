import express from 'express'
import morgan from 'morgan'
import { AppRouter } from './routes'

import 'dotenv/config'

import '../database/connect'

class Application {
  public readonly app: express.Application
  private readonly _router: express.Router

  constructor (router: express.Router) {
    this.app = express()
    this._router = router
    this._middlewares()
  }

  private _middlewares () {
    this.app.use((req, res, next) => {
      res.set('X-Powered-By', 'PHP/7.1.7')
      return next()
    })
    this.app.use(express.json())
    this.app.use(morgan('dev'))
    this.app.use('/api', this._router)
  }
}

const router = new AppRouter()

export default new Application(router.routes).app
