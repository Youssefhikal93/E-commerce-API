import express from 'express'
import { orderController } from '~/controllers/orderController'
import { restrictTo, verfiyUser } from '~/middleWares.ts/authMiddlewars'

const orderRoute = express.Router()

orderRoute.use(verfiyUser)
orderRoute.get('/all', restrictTo('ADMIN'), orderController.getAllOrders)

orderRoute.route('/')
    .post(orderController.createOrder)
    .get(orderController.getMyOrders)

orderRoute.route('/:id')
    .patch(restrictTo('ADMIN', 'SHOP'), orderController.editOrderStatus)
    .get(orderController.getMyOrder)
    .delete()


export default orderRoute