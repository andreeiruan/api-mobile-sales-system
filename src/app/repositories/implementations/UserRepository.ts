import { User } from '@entities/User'
import { IUserAttributes, IUserRepository } from '@repositories/interfaces/IUserRepository'
import { getRepository } from 'typeorm'

export class UserRepository implements IUserRepository {
  async create (data: IUserAttributes): Promise<User> {
    const repository = getRepository(User)

    const user = repository.create(data)
    await repository.save(user)

    return user
  }

  async findByEmail (email: string): Promise<User> {
    const repository = getRepository(User)

    const user = await repository.findOne({ where: { email } })

    return user
  }

  async findById (id: string): Promise<User> {
    const repository = getRepository(User)

    const user = await repository.findOne({ where: { id } })

    return user
  }
}
