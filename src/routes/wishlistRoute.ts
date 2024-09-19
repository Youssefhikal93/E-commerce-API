import express from 'express'
import { wishlistController } from '~/controllers/wishlistController'
import { restrictTo, verfiyUser } from '~/middleWares.ts/authMiddlewars'


const wishlistRoute = express.Router()

wishlistRoute.use(verfiyUser, restrictTo('USER'))

wishlistRoute.route('/')
    .post(wishlistController.createWishlist)
    .get(wishlistController.getWishlists)

wishlistRoute.delete('/:id', wishlistController.deleteWishlist)

export default wishlistRoute