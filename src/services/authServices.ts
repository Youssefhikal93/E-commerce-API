import { User } from '@prisma/client'
import { prisma } from '~/prisma'
import jwt from 'jsonwebtoken'
import { AuthLogin, AuthRegiester } from '~/interfaces/authServiceinterfaces'
import bcrypt from 'bcrypt'
import { BadRequestException, UnauthorizedException } from '~/middleWares.ts/errorMiddleware'

class AuthService {
  public async addUser(requestBody: AuthRegiester) {
    const { email, firstName, lastName, avatar, password } = requestBody

    const hasedPassword: string = await bcrypt.hash(password, 12)

    const token: string = this.generateJwt({ email, firstName, lastName })

    const newUser: User = await prisma.user.create({
      data: {
        email,
        password: hasedPassword,
        firstName,
        lastName,
        avatar
      }
    })
    return { newUser, token }
  }
  private generateJwt(payload: any) {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN
    })
  }

  private async getUserByEmail(email: string) {
    return await prisma.user.findFirst({
      where: {
        email
      }
    })
  }

  public async isEmailUnique(email: string) {
    const userByEmail = await prisma.user.findFirst({
      where: {
        email
      }
    })
    return userByEmail != null
  }

  public async login(requestBody: AuthLogin) {
    //check the user
    const user: User | null = await this.getUserByEmail(requestBody.email)
    if (!user) {
      throw new BadRequestException('invalid email or password')
    }
    // compare the password
    const matchedPasswored: boolean = await bcrypt.compare(requestBody.password, user.password)
    if (!matchedPasswored) {
      throw new UnauthorizedException('invalid email or password')
    }
    //generate JWT
    const paylaod = { email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, id: user.id }
    const token: string = await this.generateJwt(paylaod)
    return token
  }
}
export const authService: AuthService = new AuthService()
