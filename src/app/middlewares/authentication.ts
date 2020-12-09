import { appLogger } from '@helpers/Logger'
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export default (request: Request, response: Response, next: NextFunction) => {
  const { authorization } = request.headers

  if (!authorization) {
    appLogger.logWarn({ error: 'Token not found', ip: request.ip, path: request.path })
    return response.status(401).json({ error: 'Not Authorized' })
  }

  const partsToken = authorization.split(' ')

  if (partsToken.length !== 2) {
    appLogger.logWarn({ error: 'Token format invalid', ip: request.ip, path: request.path })
    return response.status(401).json({ error: 'Not Authorized' })
  }

  const [scheme, token] = partsToken

  if (!/^Bearer$/i.test(scheme)) {
    appLogger.logWarn({ error: 'Bearer format invalid', ip: request.ip, path: request.path })
    return response.status(401).json({ error: 'Not Authorized' })
  }

  jwt.verify(token, process.env.SIGN_SECRET, (err, decoded) => {
    if (err) {
      appLogger.logWarn({ error: 'Token invalid', ip: request.ip, path: request.path })
      return response.status(401).json({ error: 'Not Authorized' })
    }

    // @ts-ignore
    const { id } = decoded

    request.loggedId = id
    return next()
  })
}
