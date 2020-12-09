import { appLogger } from '@helpers/Logger'
import { SignInUseCase } from '@useCases/users/SignInUseCase'
import { Request, Response } from 'express'

export class SignInControllerExpress {
  private readonly _signInUseCase: SignInUseCase

  constructor (signInUseCase: SignInUseCase) {
    this._signInUseCase = signInUseCase
  }

  async handle (request: Request, response: Response): Promise<Response> {
    try {
      const { body, statusCode } = await this._signInUseCase.execute(request.body)
      if (statusCode === 401) {
        appLogger.logWarn({ ip: request.ip, body: request.body })
      }
      return response.status(statusCode).json(body)
    } catch (error) {
      appLogger.logError({ error: error.message, path: request.path })
      return response.status(500).json({ error: 'Unexpected error' })
    }
  }
}
