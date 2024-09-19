import { Coupon, Product, User } from "@prisma/client";
import { UserPayLoad } from "~/interfaces/UserInterface";
import { UnauthorizedException } from "~/middleWares.ts/errorMiddleware";

export class helper {

    public static checkPermisson<Entity extends { [key: string]: any }>(entity: Entity, entityProperty: string, loggedUser: UserPayLoad) {

        if (entity[entityProperty] !== loggedUser.id && loggedUser.role !== 'ADMIN') {
            throw new UnauthorizedException('You are not permitted to update the current records')
        }


    }

    public static getOrderPriceWithCoupon(coupon: Coupon, totalOrderPrice: number) {

        if (coupon.discountType === 'PERCENT') {
            // return totalOrderPrice * (coupon.discountPrice / 100)
            return totalOrderPrice * (1 - coupon.discountPrice / 100);

        } else if (coupon.discountType === 'VALUE') {
            return totalOrderPrice - coupon.discountPrice
        }
        return totalOrderPrice
    }
}


// public static checkPermisson(product: Product, loggedUser: UserPayLoad) {

//     if (product.shopId !== loggedUser.id && loggedUser.role !== 'ADMIN') {
//         throw new UnauthorizedException('You are not permitted to update the current records')
//     }
// }

// public static checkPermissonForUser(user: User, loggedUser: UserPayLoad) {

//     if (user.id !== loggedUser.id && loggedUser.role !== 'ADMIN') {
//         throw new UnauthorizedException('You are not permitted to update the current records')
//     }
// }
