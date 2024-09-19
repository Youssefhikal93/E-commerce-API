import { Prisma, User } from '@prisma/client'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import { prisma } from '~/prisma'
import { userSchemaCreate } from '~/schemas/userSchema'
import { BadRequestException, catchAsync, UnauthorizedException } from '../middleWares.ts/errorMiddleware'
import { authController } from './authController'
import { userService } from '~/services/userService'
import { APIFeatures } from '~/utils/APIfeatuers'
import parseAndValidateId from '~/utils/parseAndValidateId'


class UserController {
  public async createUser(req: Request, res: Response) {
    const newUser = await userService.addUserByAdmin(req.body)

    res.status(201).json({
      status: 'succses',
      data: {
        user: newUser
      }
    })
  }
  public async getAllUsers(req: Request, res: Response) {

    const users = await userService.fetch(req.query)

    res.status(200).json({
      status: 'succses',
      length: users.length,
      data: {
        users
      }
    })
  }
  // public async deleteUserByAdmin(req: Request, res: Response) {
  //   const id = parseAndValidateId(req)
  //   await userService.remove(id)
  //   res.status(204).json(null)
  // }
  public async updateUser(req: Request, res: Response) {
    const id = parseAndValidateId(req)


    const user = await userService.edit(id, req.body, req.user)
    return res.status(200).json({
      status: 'succsses',
      data: {
        user
      }
    })

  }

  public async deActivateUser(req: Request, res: Response) {
    const id = parseAndValidateId(req)

    const user = await userService.deActivateUser(id, req.user)
    return res.status(204).json({
      status: 'User deactivated sucssfully',
      data: {
        user
      }
    })

  }

  public async updatePassword(req: Request, res: Response) {

    await userService.updatePasssword(req.body, req.user)

    return res.status(200).json({
      status: "succsses",
      message: 'Password updated succssfully'
    })

  }
  public async updateAvatar(req: Request, res: Response) {
    const userAvatar = await userService.updateAvatar(req.file!, req.user)
    res.status(200).json({
      status: 'Succses',
      message: 'image loaded sucssfully!',
      data: {
        Avatar: userAvatar.avatar
      }
    })
  }



  public async getMe(req: Request, res: Response) {
    return res.status(200).json(req.user)
  }
}

export const userController: UserController = new UserController()
// export { userSchemaCreate }
