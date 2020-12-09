import { UserRepository } from '@repositories/implementations/UserRepository'
import { SignUpUseCase } from './SignUpUseCase'

const userRepository = new UserRepository()

const signUpUseCase = new SignUpUseCase(userRepository)

export { signUpUseCase }
