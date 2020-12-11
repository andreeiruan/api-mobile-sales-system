import cluster from 'cluster'
import { NextFunction, Request, Response } from 'express'

export default (request: Request, response: Response, next: NextFunction) => {
  const worker = cluster.worker.id
  console.log(`Request running in worker id ${worker}`)

  return next()
}
