import { User } from '@entities/User'

export interface IUserAttributes{
  id?: string
  name: string
  email: string
  password: string
  confirmPassword?: string
}

export interface IUserRepository{
  create(data: IUserAttributes): Promise<User>
  findByEmail(email: string): Promise<User>
  findById(id: string): Promise<User>
}
