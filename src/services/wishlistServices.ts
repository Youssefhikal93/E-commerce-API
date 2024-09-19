import { Wishlist } from "@prisma/client";
import { UserPayLoad } from "~/interfaces/UserInterface";
import { wihslistRequestedBody } from "~/interfaces/wihslistInterface";
import { prisma } from "~/prisma";

class WishlistServices {

    public async add(requestedBody: wihslistRequestedBody, loggedUser: UserPayLoad): Promise<Wishlist> {

        const { productId } = requestedBody
        const wishlist = await prisma.wishlist.create({
            data: {
                productId,
                userId: loggedUser.id
            }
        })
        return wishlist
    }
    public async fetch(loggedUser: UserPayLoad): Promise<Wishlist[]> {
        const wishlists = await prisma.wishlist.findMany({
            where: {
                userId: loggedUser.id
            },
            include: {
                product: true
            }
        })
        return wishlists
    }

    public async remove(productId: number, loggedUser: UserPayLoad) {

        await prisma.wishlist.delete({
            where: {
                userId_productId: {

                    productId,
                    userId: loggedUser.id
                }
            }
        })
    }
}

export const wishlistServices: WishlistServices = new WishlistServices()