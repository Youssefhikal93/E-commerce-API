import express from 'express'
import { userController } from '../controllers/userControllers'
import { validateSchema } from '~/middleWares.ts/validateSchema'

import { userSchemaCreate } from '../schemas/userSchema'
import { catchAsync } from '~/middleWares.ts/errorMiddleware'
import { authController } from '~/controllers/authController'
import { restrictTo, verfiyUser } from '~/middleWares.ts/authMiddlewars'

const userRouter = express.Router()

userRouter.post('/signup', validateSchema(userSchemaCreate), catchAsync(authController.resgiesterUser))

userRouter.post('/login', authController.login)

userRouter.get('/me', verfiyUser, userController.getMe)

userRouter
  .route('/')
  .post(validateSchema(userSchemaCreate), catchAsync(userController.createUser))
  .get(userController.getAllUsers)

export default userRouter
