import { NextFunction, Request, Response } from 'express'
import { Schema, ValidationErrorItem } from 'joi'

const formatJoiMessage = (JoiMessage: ValidationErrorItem[]) => {
  return JoiMessage.map((el) => el.message.replace(/['"]/g, ''))
}

export const validateSchema = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false })
    if (error) {
      const message = formatJoiMessage(error.details)
      res.status(404).json({
        status: 'fail',
        message
      })
      return
    }
    next()
  }
}
