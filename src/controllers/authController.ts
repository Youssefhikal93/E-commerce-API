import { User } from '@prisma/client'
import { prisma } from '../prisma'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import { authService } from '~/services/authServices'
import { BadRequestException, UnauthorizedException } from '~/middleWares.ts/errorMiddleware'
import bcrypt from 'bcrypt';
import crypto from 'crypto'

import { Email } from '~/utils/email'
import { fail } from 'assert'
import { sendCookie } from '~/utils/sendToken'

class AuthController {
  public async resgiesterUser(req: Request, res: Response, next: NextFunction) {
    // if (await authService.isEmailUnique(req.body.email)) {
    //   //   return next(new BadRequestException('Email already exist'))
    //   // }

    const { newUser, token } = await authService.addUser(req.body, req.file)

    const url = `${req.protocol}://${req.get("host")}/users/me`;
    // console.log(url);
    await new Email(newUser, url).sendWelcome()

    sendCookie(res, token)

    res.status(201).json({
      status: 'succses',
      token,
      message: 'Please verfiy your email.',
      data: {
        user: newUser
      }
    })
  }

  public async login(req: Request, res: Response, next: NextFunction) {

    //check if the user in-active 
    // let message
    // if (req.user.isActive === false) {
    //   await prisma.user.update({
    //     where: { id: req.user.id },
    //     data: { isActive: true }
    //   });
    //   message = 'Your account was in-Active and just re-activated , welcome back ^ _ ^ '
    // }

    const token = await authService.login(req.body)


    sendCookie(res, token)

    res.status(200).json({
      status: 'succses',
      message: 'logged in succssfully',
      // token
    })
  }

  public async forgotPassword(req: Request, res: Response) {
    await authService.forgetPassword(req)


    res.status(200).json({
      status: 'success',
      message: 'Password reset token sent to email!',
      // resetURL, // Displayed for development; remove in production
    });
  }

  public async resetPassword(req: Request, res: Response) {
    const { token } = req.params; // Reset token from URL

    await authService.resetPassword(token, req.body)

    res.status(200).json({
      status: 'success',
      message: 'Password reset successful!',
    });
  }

}

export const authController: AuthController = new AuthController()
