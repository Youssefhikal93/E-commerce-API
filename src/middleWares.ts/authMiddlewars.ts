import { NextFunction, Request, RequestHandler, Response } from 'express'
import { BadRequestException, NotfoundException, UnauthorizedException } from './errorMiddleware'
import jwt from 'jsonwebtoken'
import { prisma } from '~/prisma'

export async function verfiyUser(req: Request, res: Response, next: NextFunction) {
  // getting token if exist
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }
  if (!token) {
    throw new BadRequestException('Please login to grant the accses')
  }

  //validate token
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload

  // retrive the user
  const freshUser = await prisma.user.findUnique({ where: { id: decoded.id } })

  if (!freshUser) {
    throw new UnauthorizedException('User associated with this token no longer exists')
  }
  //grant accses
  // req.currentUser = decoded
  req.user = freshUser


  next()
}



export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {

      throw new UnauthorizedException('User have no persmission to procced wth the action')
    }
    next()
  }
}
