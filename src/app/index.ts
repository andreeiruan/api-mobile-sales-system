import 'reflect-metadata'
import express from 'express'
import compression from 'compression'
import morgan from 'morgan'
import { routerProducts, routerSales, routerShipment, routerUser, routerBot } from './routes'
import Bullboard from 'bull-board'
import { createServer, Server } from 'http'
import socketIo from 'socket.io'
import cors from 'cors'
// import cluster from './middlewares/cluster'

import 'dotenv/config'

import '../database/connect'
import { Queue } from '@providers/Queue'

class Application {
  public readonly app: express.Application
  public server: Server
  public io: socketIo.Server

  constructor () {
    this.app = express()
    Bullboard.setQueues(Queue.instance().queues.map(queue => queue.bull))
    this._middlewares()
    this._socket()
    this._routes()
  }

  private _middlewares () {
    this.app.use(cors())
    this.app.use((req, res, next) => {
      res.set('X-Powered-By', 'PHP/7.1.7')
      return next()
    })
    this.app.use(express.json())
    this.app.use(compression())
    this.app.use(morgan('dev'))
    this.app.use('/admin/queue', Bullboard.UI)
    // this.app.use(cluster)
  }

  private _routes () {
    this.app.use('/api', routerUser)
    this.app.use('/api', routerProducts)
    this.app.use('/api', routerShipment)
    this.app.use('/api', routerSales)
    this.app.use('/api', routerBot)
  }

  private _socket () {
    this.server = createServer(this.app)
    // @ts-ignore
    this.io = socketIo(this.server)
    this.app.use((req, res, next) => {
      req.io = this.io
      return next()
    })
  }
}

export default new Application().app
