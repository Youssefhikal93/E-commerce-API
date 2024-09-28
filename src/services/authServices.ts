import { User } from '@prisma/client'
import { prisma } from '~/prisma'
import jwt from 'jsonwebtoken'
import { AuthLogin, AuthRegiester } from '~/interfaces/authServiceinterfaces'
import bcrypt from 'bcrypt'
import { BadRequestException, NotfoundException, UnauthorizedException } from '~/middleWares.ts/errorMiddleware'
import crypto from 'crypto'
import { Email } from '~/utils/email'
import { Request, Response } from 'express'


class AuthService {
  public async addUser(requestBody: AuthRegiester, avatar?: Express.Multer.File) {
    const { id, email, firstName, lastName, password } = requestBody

    const hasedPassword: string = await bcrypt.hash(password, 12)


    const newUser: User = await prisma.user.create({
      data: {
        email,
        password: hasedPassword,
        firstName,
        lastName,
        avatar: avatar ? avatar.filename : ''
      }
    })
    const token: string = this.generateJwt({ id: newUser.id, email, firstName, lastName, role: newUser.role })



    return { newUser, token }
    // return { newUser }
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
        lastLoginAttemps: new Date(),
        passwordResetExpires: null,
        passwordResetToken: null
      }
    })


    //generate JWT
    const paylaod = { email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, id: user.id }
    const token: string = await this.generateJwt(paylaod)
    return token
  }

  public async generatePasswordResetToken(userId: number) {
    // Create a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Encrypt the token (hashed) to store it securely in the database
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set token expiry (e.g., 10 minutes)
    const tokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Save the hashed token and expiration date to the user record in the database
    await prisma.user.update({
      where: { id: userId },
      data: {
        passwordResetToken: hashedToken,
        passwordResetExpires: tokenExpiresAt,
      },
    });

    return resetToken;
  }

  public async forgetPassword(req: Request) {
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
    const resetToken = await authService.generatePasswordResetToken(user.id);

    // URL
    const resetURL = `${req.protocol}://${req.get('host')}/resetPassword/${resetToken}`;

    // Send the resetURL to user's email in a real implementation
    await new Email(user, resetURL).sendPasswordReset()
  }

  public async resetPassword(token: string, requestedBody: any) {
    const { password } = requestedBody; // New password from form

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
  }

  public async forgetPasswordByTempPassword(req: Request) {
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
    const TempPassword = crypto.randomBytes(8).toString('hex')
    const tokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000)

    const hashedTempPassword = crypto.createHash('sha256').update(TempPassword).digest('hex')

    // update currentPassword with the temp password 
    const existingUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: hashedTempPassword,
        passwordResetExpires: tokenExpiresAt
      }
    })

    // URL containg the temp password
    const resetURL = `${req.protocol}://${req.get('host')}/resetPassword`;

    // Send the resetURL to user's email in a real implementation
    await new Email(user, resetURL).sendPasswordResetTempPassword(existingUser)
  }

  public async resetPasswordByTempPassword(requestedBody: any) {
    const { tempPassword, newPassword, confirmNewPassword } = requestedBody; // New password from form

    const hashedTempPassword = crypto.createHash('sha256').update(tempPassword).digest('hex');

    const user = await prisma.user.findFirst({ where: { passwordResetToken: hashedTempPassword } });
    if (!user) throw new NotfoundException('Temp Password Reset Code Invalid');

    if (user.passwordResetExpires! < new Date(Date.now())) {
      throw new BadRequestException('Password Reset Code already expired, please forgot again!');
    }

    if (newPassword !== confirmNewPassword) throw new BadRequestException('Password and confirm new password must be the same!');

    // Find the user with this reset token and ensure the token hasn't expired
    const hashedPassword: string = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id }, data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null
      }
    })


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
