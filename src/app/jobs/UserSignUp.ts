import { JobProtocol } from './JobProtocol'

const userJob: JobProtocol = {
  key: 'UserSignUp',
  async handle ({ data }): Promise<any> {
    const { email, name } = data
    console.log(`Send confirmation mail to ${email} reference the user ${name}`)
  }
}

export { userJob }
