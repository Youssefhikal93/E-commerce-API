import express from 'express'
import { couponController } from '~/controllers/couponController'
import { orderController } from '~/controllers/orderController'
import { restrictTo, verfiyUser } from '~/middleWares.ts/authMiddlewars'

const couponRoute = express.Router()

couponRoute.use(verfiyUser, restrictTo('ADMIN', 'SHOP'))

couponRoute.route('/')
    .post(couponController.createCoupon)
    .get(couponController.getMycoupons)


couponRoute.route('/:code')
    .delete(couponController.deleteOne)


export default couponRoute