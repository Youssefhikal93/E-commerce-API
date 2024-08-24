import { User } from '@prisma/client'
import { prisma } from '../prisma'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import { authService } from '~/services/authServices'
import { BadRequestException } from '~/middleWares.ts/errorMiddleware'

class AuthController {
  public async resgiesterUser(req: Request, res: Response, next: NextFunction) {
    if (await authService.isEmailUnique(req.body.email)) {
      return next(new BadRequestException('Email already exist'))
    }

    const { newUser, token } = await authService.addUser(req.body)

    res.status(201).json({
      status: 'succses',
      token,
      data: {
        user: newUser
      }
    })
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    const token = await authService.login(req.body)

    res.status(200).json({
      status: 'succses',
      message: 'User logged in succsfully',
      token
    })
  }
}

export const authController: AuthController = new AuthController()
