import { UserRepository } from '@repositories/implementations/UserRepository'
import { SignInUseCase } from './SignInUseCase'
import { SignUpUseCase } from './SignUpUseCase'

const userRepository = new UserRepository()

const signUpUseCase = new SignUpUseCase(userRepository)
const signInUseCase = new SignInUseCase(userRepository)

export { signUpUseCase, signInUseCase }
