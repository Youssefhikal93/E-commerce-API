import { Status, User } from "@prisma/client";
import { ReviewBodyCreate, ReviewBodyUpdate } from "~/interfaces/reviewInterface";
import { UserPayLoad } from "~/interfaces/UserInterface";
import { BadRequestException } from "~/middleWares.ts/errorMiddleware";
import { prisma } from "~/prisma";

class ReviewService {
    public async addReview(requestedBody: ReviewBodyCreate, loggedUser: UserPayLoad) {
        //make sure user bought the same product
        const { productId, rating, comment } = requestedBody

        const orders = await prisma.order.findMany({
            where: {
                userId: loggedUser.id,
                orderItems: {
                    some: {
                        productId
                    }
                }
            },
            include: { orderItems: true }
        })
        //make sure the product has been ordered
        if (orders.length === 0) {
            throw new BadRequestException('Review is only possible for the users who bought the product')
        }

        const hasDeliveredOrder = orders.some(order =>
            order.orderItems.some(item =>
                item.productId === productId && order.status === Status.DELIEVERD
            )
        );


        if (!hasDeliveredOrder) {
            throw new BadRequestException('You can only post your review after receiving the product');
        }

        const existingReview = await prisma.review.findFirst({
            where: {
                userId: loggedUser.id,
                productId
            }
        })

        if (existingReview) {
            throw new BadRequestException(`You already wrote a review for this product with id ${existingReview.id} you may delete it or update it using the provided id `)
        }

        const review = await prisma.review.create({
            data: { rating, comment, productId, userId: loggedUser.id }
        })

        return review
    }

    public async editReview(reviewId: number, requestedBody: ReviewBodyUpdate, loggedUser: UserPayLoad) {
        const { rating, comment } = requestedBody
        const updatedReview = await prisma.review.update({
            where: {
                id: reviewId,
                userId: loggedUser.id
            },
            data: { rating, comment }
        })
        return updatedReview
    }

    public async deleteReview(reviewId: number, loggedUser: UserPayLoad) {
        await prisma.review.delete({
            where: {
                id: reviewId,
                userId: loggedUser.id
            },
        })

    }
    public async deleteReviewByAdmin(reviewId: number) {
        await prisma.review.delete({
            where: {
                id: reviewId,
            },
        })

    }

    public async getAvgRating(productId: number) {
        const aggregation = await prisma.review.aggregate({
            _avg: {
                rating: true
            },
            where: {
                productId
            }
        })
        return aggregation._avg.rating
    }

    // private async getReviewForloggedUser(reviewId:number,loggedUser:UserPayLoad){
    //     const review = await prisma.review.findUnique({
    //         where: {
    //             id: reviewId,
    //             userId: loggedUser.id
    //         },
    //     })
    //     if(!review){
    //         throw new BadRequestException('No review found to perform the required action')
    //     }
    //     return review
    // }
}

export const reviewService: ReviewService = new ReviewService()