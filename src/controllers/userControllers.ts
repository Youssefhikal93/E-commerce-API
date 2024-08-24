import { Prisma, User } from '@prisma/client'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import { prisma } from '~/prisma'
import { userSchemaCreate } from '~/schemas/userSchema'
import { BadRequestException, catchAsync } from '../middleWares.ts/errorMiddleware'
import { authController } from './authController'

class UserController {
  public async createUser(req: Request, res: Response, next: NextFunction) {
    const { email, firstName, lastName, avatar, password } = req.body

    const newUser: User = await prisma.user.create({
      data: {
        email,
        password,
        firstName,
        lastName,
        avatar
      }
    })
    res.status(201).json({
      status: 'succses',
      data: {
        user: newUser
      }
    })
  }
  public async getAllUsers(req: Request, res: Response, next: NextFunction) {
    const users = await prisma.user.findMany()
    res.status(200).json({
      status: 'succses',
      length: users.length,
      data: {
        users
      }
    })
  }

  public async getMe(req: Request, res: Response, next: NextFunction) {
    return res.status(200).json(req.user)
  }
}

export const userController: UserController = new UserController()
export { userSchemaCreate }
