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
      return response.status(statusCode).json(body)
    } catch (error) {
      return response.status(500).json({ error: 'Unexpected error' })
    }
  }
}
