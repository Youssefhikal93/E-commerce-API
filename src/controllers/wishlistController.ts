import { Request, Response } from "express";
import { wishlistServices } from "~/services/wishlistServices";
import parseAndValidateId from "~/utils/parseAndValidateId";

class WishlistController {
    public async createWishlist(req: Request, res: Response) {
        const withslist = await wishlistServices.add(req.body, req.user)
        return res.status(201).json({
            status: 'succes',
            data: {
                withslist
            }
        })
    }

    public async getWishlists(req: Request, res: Response) {
        const wishlists = await wishlistServices.fetch(req.user)

        return res.status(200).json({
            status: 'succses',
            results: wishlists.length,
            data: {
                wishlists
            }
        })
    }

    public async deleteWishlist(req: Request, res: Response) {
        const id = parseAndValidateId(req)
        await wishlistServices.remove(id, req.user)

        res.status(204).json(null)
    }
}

export const wishlistController: WishlistController = new WishlistController()