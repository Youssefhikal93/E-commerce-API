import express from 'express'
import { userController } from '../controllers/userControllers'
import { validateSchema } from '~/middleWares.ts/validateSchema'

import { userSchemaCreate, userSchemaUpdate } from '../schemas/userSchema'
import { catchAsync } from '~/middleWares.ts/errorMiddleware'
import { authController } from '~/controllers/authController'
import { preventInActiveUsers, restrictTo, verfiyUser } from '~/middleWares.ts/authMiddlewars'
import { upload, uploadAvatar } from '~/utils/uploads'

const userRouter = express.Router()


userRouter.post('/forgotPassword', authController.forgotPassword);
userRouter.patch('/resetPassword/:token', authController.resetPassword);

userRouter.post('/forgotPasswordTempPassword', authController.forgotPasswordByTempPassword)
userRouter.patch('/resetPasswordTempPassword', authController.resetPasswordByTempPassword);

userRouter.post('/signup',
  uploadAvatar.single('avatar'),
  validateSchema(userSchemaCreate),
  authController.resgiesterUser)

userRouter.post('/login', authController.login)

userRouter.get('/me', verfiyUser, userController.getMe)

userRouter.post('/changePassword', verfiyUser, userController.updatePassword)

userRouter.use(verfiyUser)

userRouter.patch('/updateAvatar', uploadAvatar.single('avatar'), userController.updateAvatar)


userRouter
  .route('/')
  .post(validateSchema(userSchemaCreate), restrictTo('ADMIN'), userController.createUser)
  .get(restrictTo('ADMIN'), userController.getAllUsers)

userRouter.route('/:id')
  .delete(userController.deActivateUser)
  .patch(validateSchema(userSchemaUpdate), userController.updateUser)
// .delete(verfiyUser, restrictTo('ADMIN'), userController.deleteUserByAdmin)

export default userRouter
