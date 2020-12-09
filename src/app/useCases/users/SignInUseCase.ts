import { Cryptography } from '@helpers/Cryptography'
import { MissingParamError } from '@helpers/errors/missingParamError'
import { NotAuthorizedError } from '@helpers/errors/NotAuthorizedError'
import { NotFoundError } from '@helpers/errors/notFoundError'
import { ServerError } from '@helpers/errors/serverError'
import { HttpResponse, IHttpResponse } from '@helpers/HttpResponse'
import { appLogger } from '@helpers/Logger'
import { IUserRepository } from '@repositories/interfaces/IUserRepository'

interface ISignInDTO{
  email: string
  password: string
}

export class SignInUseCase {
  private readonly _userReporitory: IUserRepository

  constructor (userReporitory: IUserRepository) {
    this._userReporitory = userReporitory
  }

  async execute (data: ISignInDTO): Promise<IHttpResponse> {
    try {
      const { email, password } = data
      if (!email) {
        return HttpResponse.badRequest(new MissingParamError('email'))
      }

      if (!password) {
        return HttpResponse.badRequest(new MissingParamError('password'))
      }

      const user = await this._userReporitory.findByEmail(email)
      if (!user) {
        return HttpResponse.notFound(new NotFoundError('user'))
      }

      const checkedPassword = await Cryptography.checkPassword(password, user.password)
      if (!checkedPassword) {
        return HttpResponse.notAuthorized(new NotAuthorizedError())
      }

      const token = Cryptography.generateToken({ id: user.id }, process.env.SIGN_SECRET)

      user.password = undefined

      return HttpResponse.created({
        user,
        token
      })
    } catch (error) {
      appLogger.logError({ error: error.message, filename: __filename })
      return HttpResponse.serverError(new ServerError())
    }
  }
}
