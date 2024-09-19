import express from 'express'
import { cartController } from '~/controllers/cartController'
import { verfiyUser } from '~/middleWares.ts/authMiddlewars'
import { validateSchema } from '~/middleWares.ts/validateSchema'
import { cartSchemaUpdate } from '~/schemas/cartSchema'

const cartRoute = express.Router()

cartRoute.use(verfiyUser)

cartRoute.route('/')
    .post(validateSchema(cartSchemaUpdate), cartController.createCart)
    .get(cartController.getCart)
    .delete(cartController.deleteCart)

cartRoute.route('/:id')
    .delete(cartController.deleteCartItem)


export default cartRoute