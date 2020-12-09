import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export class Cryptography {
  static async criptPassword (password: string): Promise<string> {
    return await bcrypt.hash(password, 8)
  }

  static async checkPassword (password: string, comparePassword: string): Promise<boolean> {
    return await bcrypt.compare(password, comparePassword)
  }

  static generateToken (data: any, secret: string) : string {
    return jwt.sign(data, secret, { expiresIn: '12h' })
  }
}
