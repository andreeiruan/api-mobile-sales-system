import express from 'express'

class Application {
  public readonly app: express.Application

  constructor () {
    this.app = express()
  }

  private _middlewares () {
    this.app.use((req, res, next) => {
      res.set('X-Powered-By', 'PHP/7.1.7')
      return next()
    })
    this.app.use(express.json())
  }
}

export default new Application().app
