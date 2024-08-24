import { Product } from "@prisma/client";
import { UserPayLoad } from "~/interfaces/UserInterface";
import { UnauthorizedException } from "~/middleWares.ts/errorMiddleware";

export class helper {

    public static checkPermisson(product: Product, loggedUser: UserPayLoad) {

        if (product.shopId !== loggedUser.id && loggedUser.role !== 'ADMIN') {
            throw new UnauthorizedException('You are not permitted to update the current records')
        }
    }

}