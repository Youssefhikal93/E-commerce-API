import { Request, Response } from "express"
import { couponService } from "~/services/coupounService"

class CouponController {
    public async createCoupon(req: Request, res: Response) {
        const newCoupon = await couponService.addCoupon(req.body, req.user)
        return res.status(201).json({
            status: 'succses',
            data: {
                newCoupon
            }
        })
    }

    public async getMycoupons(req: Request, res: Response) {
        const coupons = await couponService.fetch(req.user)
        return res.status(200).json({
            status: 'succses',
            length: coupons.length,
            data: {
                coupons
            }
        })
    }

    public async deleteOne(req: Request, res: Response) {


        await couponService.remove(req.params.code, req.user)
        res.status(204).json({
            data: null
        })
    }
}

export const couponController: CouponController = new CouponController()
