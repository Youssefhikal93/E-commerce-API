import { User } from '@prisma/client'
import { prisma } from '~/prisma'
import jwt from 'jsonwebtoken'
import { AuthLogin, AuthRegiester } from '~/interfaces/authServiceinterfaces'
import bcrypt from 'bcrypt'
import { BadRequestException, UnauthorizedException } from '~/middleWares.ts/errorMiddleware'
import crypto from 'crypto'


class AuthService {
  public async addUser(requestBody: AuthRegiester, avatar: Express.Multer.File) {
    const { id, email, firstName, lastName, password } = requestBody

    const hasedPassword: string = await bcrypt.hash(password, 12)

    const token: string = this.generateJwt({ id, email, firstName, lastName })

    const newUser: User = await prisma.user.create({
      data: {
        email,
        password: hasedPassword,
        firstName,
        lastName,
        avatar: avatar.filename
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
      throw new BadRequestException("Email dosn't exisit")
    }



    if (user.loginAttempts > 2) {
      await this.blockUser(user)
    }

    // if user is blcoked 
    if (user.isBlocked) {
      throw new UnauthorizedException('User is blocked , please contact our support team')
    }



    // compare the password
    const matchedPasswored: boolean = await bcrypt.compare(requestBody.password, user.password)
    if (!matchedPasswored) {

      await prisma.user.update({
        where: { id: user.id },
        data: {
          loginAttempts: user.loginAttempts + 1
        }
      })

      throw new UnauthorizedException('invalid email or password')
    }

    // reset login attemps and adjust last login if succcssful
    await prisma.user.update({
      where: { id: user.id },
      data: {
        loginAttempts: user.loginAttempts = 0,
        lastLoginAttemps: new Date()
      }
    })


    //generate JWT
    const paylaod = { email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, id: user.id }
    const token: string = await this.generateJwt(paylaod)
    return token
  }

  private async blockUser(user: User) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isBlocked: true
      }
    })
  }



}
export const authService: AuthService = new AuthService()
