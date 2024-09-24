import { Request, Response } from "express";
import { date } from "joi";
import { reviewService } from "~/services/reviewServices";
import parseAndValidateId from "~/utils/parseAndValidateId";

class ReviewController {

    public async createReview(req: Request, res: Response) {
        const review = await reviewService.addReview(req.body, req.user)

        return res.status(200).json({
            status: 'sucsses',
            date: {
                review
            }
        })
    }
    public async updateReview(req: Request, res: Response) {
        const id = parseAndValidateId(req)
        const updatedReview = await reviewService.editReview(id, req.body, req.user)
        return res.status(200).json({
            status: 'sucsses',
            date: {
                updatedReview
            }
        })

    }
    public async getAvgForProduct(req: Request, res: Response) {
        const id = parseAndValidateId(req)

        const avg = await reviewService.getAvgRating(id)
        return res.status(200).json({
            status: 'sucsses',
            date: {
                avg
            }
        })
    }

    public async deleteReview(req: Request, res: Response) {
        const id = parseAndValidateId(req)
        await reviewService.deleteReview(id, req.user)
        return res.status(204).json(null)

    }
    public async deleteReviewByAdmin(req: Request, res: Response) {
        const id = parseAndValidateId(req)
        await reviewService.deleteReviewByAdmin(id)
        return res.status(204).json(null)

    }
}

export const reviewController: ReviewController = new ReviewController()