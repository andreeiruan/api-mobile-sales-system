export class NotAuthorizedError extends Error {
  constructor (message: string) {
    super(`Not Authorized: ${message}`)
    this.name = 'NotAuthorizedError'
  }
}
