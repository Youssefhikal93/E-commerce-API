import { UserPayLoad } from "~/interfaces/UserInterface"
import { prisma } from "~/prisma"
import { userService } from "./userService"
import { helper } from "~/utils/helpers"
import { NotfoundException } from "~/middleWares.ts/errorMiddleware"
import { CouponBody } from "~/interfaces/couponInterface"

class CouponService {
    public async addCoupon(requestedBody: CouponBody, loggedUser: UserPayLoad) {
        const { discountType, discountPrice, code } = requestedBody

        const newCoupon = await prisma.coupon.create({
            data: {
                userId: loggedUser.id,
                discountPrice,
                code,
                discountType
            }
        })
        return newCoupon
    }
    public async fetch(loggedUser: UserPayLoad) {
        const coupons = await prisma.coupon.findMany({
            where: {
                userId: loggedUser.id
            }
        })
        return coupons
    }

    public async fetchAll(query: any) {
        const { filterBy, filterValue, filterCondition } = query
        const whereClause: any = {}
        if (filterBy && filterCondition && filterValue) {
            if (filterBy === 'discountPrice' || filterBy === 'createdAt') {

                whereClause[filterBy] = {
                    [filterCondition]: query.filterValue,
                }
            } else {
                whereClause[filterBy] = {
                    [filterCondition]: query.filterValue,
                    mode: 'insensitive'

                }
            };
        }
        const coupons = await prisma.coupon.findMany({
            where: whereClause
        })
        return coupons
    }

    public async remove(couponeCode: string, loggedUser: UserPayLoad) {

        const existingCoupon = await this.getCouponByCopuneCode(couponeCode)

        helper.checkPermisson(existingCoupon, 'userId', loggedUser)

        await prisma.coupon.delete({
            where: { code: couponeCode }
        })

    }

    public async getCouponByCopuneCode(couponeCode: string) {
        const copoun = await prisma.coupon.findFirst({
            where: { code: couponeCode },

        });

        if (!copoun) {
            throw new NotfoundException(`No coupun found with the provided name ${couponeCode}`)
        }
        return copoun
    }


}

export const couponService: CouponService = new CouponService()