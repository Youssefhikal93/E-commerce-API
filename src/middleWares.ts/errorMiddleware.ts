import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { NextFunction, Request, Response } from 'express'
import { func } from 'joi'

export abstract class CustomError extends Error {
  abstract status: string
  abstract statusCode: number
  constructor(message: string) {
    super(message)
  }
  public getError() {
    return {
      status: this.status,
      statusCode: this.statusCode,
      message: this.message
    }
  }
}

export class BadRequestException extends CustomError {
  status: string = 'error'
  statusCode: number = 400
  constructor(message: string) {
    super(message)
  }
}

export class UnauthorizedException extends CustomError {
  status: string = 'error'
  statusCode: number = 401

  constructor(message: string) {
    super(message)
  }
}

export class FprbiddenException extends CustomError {
  status: string = 'error'
  statusCode: number = 403

  constructor(message: string) {
    super(message)
  }
}

export class NotfoundException extends CustomError {
  status: string = 'error'
  statusCode: number = 404

  constructor(message: string) {
    super(message)
  }
}

export class InternalServelException extends CustomError {
  status: string = 'error'
  statusCode: number = 500

  constructor(message: string) {
    super(message)
  }
}

// export const catchAsync = (fn: any) => async (req: Request, res: Response, next: NextFunction) => {
//   fn(req, res, next).catch(next)
// }

export const catchAsync = (fn: any) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await fn(req, res, next)
  } catch (err: any) {
    next(new InternalServelException(err.message))
  }
}


class FormatErrorMsg {
  public formatError(err: any, res: Response) {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (err instanceof PrismaClientKnownRequestError && err.code == 'P2002') {

      err = this.handelValidationDB(err)
    }
    if (err instanceof PrismaClientKnownRequestError && err.code == 'P2003') {

      err = this.handelnonExixtingFkDB(err)
    }


    if (process.env.NODE_ENV === 'development') {
      this.sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {

      this.sendErrorProd(err, res);
    }

  };
  private sendErrorDev = (err: any, res: Response) => {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  };

  private sendErrorProd = (err: any, res: Response) => {
    if (err.statusCode !== 500) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else
      return res.status(500).json({
        status: 'error',
        message: 'Issue occurred, please try again later',
      });
  };

  private handelValidationDB(err: any) {
    return new BadRequestException(`invalid inputs:${err.meta.target} must be unique`)
  }
  private handelnonExixtingFkDB(err: any) {
    return new BadRequestException(`invalid inputs:${err.meta.field_name} not exist`)
  }


}
export const formatErrorMsg = new FormatErrorMsg();