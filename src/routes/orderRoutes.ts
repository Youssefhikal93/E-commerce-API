import express from 'express'
import { orderController } from '~/controllers/orderController'
import { restrictTo, verfiyUser } from '~/middleWares.ts/authMiddlewars'
import { validateSchema } from '~/middleWares.ts/validateSchema'
import { OrderSchemaCreate } from '~/schemas/orderSchema'

const orderRoute = express.Router()

orderRoute.use(verfiyUser)
orderRoute.get('/all', restrictTo('ADMIN'), orderController.getAllOrders)

orderRoute.route('/')
    .post(validateSchema(OrderSchemaCreate), orderController.createOrder)
    .get(orderController.getMyOrders)

orderRoute.route('/:id')
    .patch(restrictTo('ADMIN', 'SHOP'), orderController.editOrderStatus)
    .get(orderController.getMyOrder)


export default orderRoute