import express from 'express'
import { categoryController } from '~/controllers/categoryController'
import { validateSchema } from '~/middleWares.ts/validateSchema'
import { categorySchemaCreate } from '~/schemas/categorySchema'

const categoryRoute = express.Router()

categoryRoute
  .route('/')
  .post(validateSchema(categorySchemaCreate), categoryController.create)
  .get(categoryController.getAll)

categoryRoute
  .route('/:id')
  .get(categoryController.getOne)
  .patch(validateSchema(categorySchemaCreate), categoryController.updateOne)
  .delete(categoryController.deleteOne)
export default categoryRoute
