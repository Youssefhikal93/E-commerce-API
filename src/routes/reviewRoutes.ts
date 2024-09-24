import express from 'express'
import { reviewController } from '~/controllers/reviewController'
import { restrictTo, verfiyUser } from '~/middleWares.ts/authMiddlewars'
import { validateSchema } from '~/middleWares.ts/validateSchema'
import { reviewSchemaCreate, reviewSchemaUpdate } from '~/schemas/reviewSchema'


const reviewRoute = express.Router()

reviewRoute.get('/avg/:id', reviewController.getAvgForProduct)

reviewRoute.delete('/review/:id', verfiyUser, restrictTo('ADMIN'), reviewController.deleteReviewByAdmin)

reviewRoute.use(verfiyUser, restrictTo('USER'))

reviewRoute.route('/')
    .post(validateSchema(reviewSchemaCreate), reviewController.createReview)

reviewRoute.route('/:id')
    .put(validateSchema(reviewSchemaUpdate), reviewController.updateReview)
    .delete(reviewController.deleteReview)






export default reviewRoute