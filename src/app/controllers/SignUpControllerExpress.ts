import { SignUpUseCase } from '@useCases/users/SignUpUseCase'
import { Request, Response } from 'express'

export class SignUpUseControllerExpress {
  private readonly _signUpUseCase: SignUpUseCase

  constructor (signUpUseCase: SignUpUseCase) {
    this._signUpUseCase = signUpUseCase
  }

  async handle (request: Request, response: Response): Promise<Response> {
    try {
      const { name, email, password, confirmPassword } = request.body
      const { body, statusCode } = await this._signUpUseCase.execute({ name, email, password, confirmPassword })
      return response.status(statusCode).json(body)
    } catch (error) {
      return response.status(500).json({ error: 'Unexpected error' })
    }
  }
}
