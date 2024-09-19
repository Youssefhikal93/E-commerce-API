import { Request, Response } from "express";
import { cartServices } from "~/services/cartServices";
import { helper } from "~/utils/helpers";
import parseAndValidateId from "~/utils/parseAndValidateId";

class CartController {
    public async createCart(req: Request, res: Response) {
        const cart = await cartServices.addToCart(req.body, req.user)

        res.status(201).json({
            status: 'sucsses',
            data: {
                cart
            }
        })
    }

    public async getCart(req: Request, res: Response) {
        const cart = await cartServices.fetchCartItems(req.user)

        return res.status(200).json({
            status: 'succses',
            data: {
                cart
            },

        })
    }

    public async deleteCart(req: Request, res: Response) {
        await cartServices.removeCart(req.user)

        return res.status(204).json(null)
    }

    public async deleteCartItem(req: Request, res: Response) {
        const id = parseAndValidateId(req)
        await cartServices.removeCartItem(id, req.user)

        return res.status(204).json(null)
    }
}

export const cartController: CartController = new CartController()