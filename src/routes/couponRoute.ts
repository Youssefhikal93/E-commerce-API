import express from 'express'
import { couponController } from '~/controllers/couponController'
import { restrictTo, verfiyUser } from '~/middleWares.ts/authMiddlewars'
import { validateSchema } from '~/middleWares.ts/validateSchema'
import { couponSchemaCreate } from '~/schemas/couponSchema'

const couponRoute = express.Router()

couponRoute.use(verfiyUser, restrictTo('ADMIN'))

couponRoute.get('/all', couponController.getAllCoupons)
couponRoute.route('/')
    .post(validateSchema(couponSchemaCreate), couponController.createCoupon)
    .get(couponController.getMycoupons)




couponRoute.route('/:code')
    .delete(couponController.deleteOne)


export default couponRoute