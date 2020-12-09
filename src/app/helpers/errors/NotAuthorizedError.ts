export class NotAuthorizedError extends Error {
  constructor () {
    super('Not Authorized')
    this.name = 'NotAuthorizedError'
  }
}
