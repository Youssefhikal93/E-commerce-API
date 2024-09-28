import express from 'express'
import { categoryController } from '~/controllers/categoryController'
import { restrictTo, verfiyUser } from '~/middleWares.ts/authMiddlewars'
import { validateSchema } from '~/middleWares.ts/validateSchema'
import { categorySchemaCreate } from '~/schemas/categorySchema'

const categoryRoute = express.Router()

categoryRoute
  .route('/')
  .post(verfiyUser, restrictTo('ADMIN'), validateSchema(categorySchemaCreate), categoryController.create)
  .get(categoryController.getAll)

categoryRoute
  .route('/:id')
  .get(categoryController.getOne)
  .patch(verfiyUser, restrictTo('ADMIN'), validateSchema(categorySchemaCreate), categoryController.updateOne)
  .delete(verfiyUser, restrictTo('ADMIN'), categoryController.deleteOne)
export default categoryRoute
