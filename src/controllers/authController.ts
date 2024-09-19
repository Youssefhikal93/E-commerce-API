import { User } from '@prisma/client'
import { prisma } from '../prisma'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import { authService } from '~/services/authServices'
import { BadRequestException, UnauthorizedException } from '~/middleWares.ts/errorMiddleware'
import bcrypt from 'bcrypt';
import crypto from 'crypto'
import { userService } from '~/services/userService'

class AuthController {
  public async resgiesterUser(req: Request, res: Response, next: NextFunction) {
    // if (await authService.isEmailUnique(req.body.email)) {
    //   //   return next(new BadRequestException('Email already exist'))
    //   // }

    const { newUser, token } = await authService.addUser(req.body, req.file!)

    res.status(201).json({
      status: 'succses',
      token,
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


    res.status(200).json({
      status: 'succses',
      message: 'logged in succssfully',
      token
    })
  }

  public async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;

    // Find the user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new BadRequestException('No user found with that email address.');
    }

    if (user.isBlocked) {
      throw new UnauthorizedException('User is blocked , please contact our support team')
    }

    // Generate the reset token
    const resetToken = await userService.generatePasswordResetToken(user.id);

    // Send reset token via email (this is just a placeholder for actual email logic)
    const resetURL = `${req.protocol}://${req.get('host')}/resetPassword/${resetToken}`;
    // Send the resetURL to user's email in a real implementation

    res.status(200).json({
      status: 'success',
      message: 'Password reset token sent to email!',
      resetURL, // Displayed for development; remove in production
    });
  }

  public async resetPassword(req: Request, res: Response) {
    const { token } = req.params; // Reset token from URL
    const { password } = req.body; // New password from form

    // Hash the token again to match the one stored in the database
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find the user with this reset token and ensure the token hasn't expired
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: { gte: new Date() }, // Token must not be expired
      },
    });

    if (!user) {
      throw new BadRequestException('Token is invalid or has expired.');
    }

    // Hash the new password and save it to the user's record
    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null, // Clear the reset token
        passwordResetExpires: null, // Clear the expiration date
      },
    });

    res.status(200).json({
      status: 'success',
      message: 'Password reset successful!',
    });
  }
}

export const authController: AuthController = new AuthController()
