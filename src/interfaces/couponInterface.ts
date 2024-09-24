import { DiscountType } from "@prisma/client";

export interface CouponBody {
    discountType: DiscountType,
    discountPrice: number,
    code: string
}