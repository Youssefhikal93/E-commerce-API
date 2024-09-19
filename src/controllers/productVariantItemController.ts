import { Request, Response } from "express";
import { productvarinatServiceItem } from "~/services/productVariantItemServices";
import parseAndValidateId from "~/utils/parseAndValidateId";

class ProductVariantControllerItem {
    public async createItem(req: Request, res: Response) {
        const item = await productvarinatServiceItem.add(+req.params.productId, +req.params.variantId, req.body, req.user)

        res.status(201).json({
            status: "succses",
            data: {
                item
            }
        })
    }

    public async deleteItem(req: Request, res: Response) {
        // const productId = +req.params.productId
        // const variantId = +req.params.variantId
        // const variantItemId = +req.params.variantItem

        await productvarinatServiceItem.remove(parseInt(req.params.productId), parseInt(req.params.variantId), parseInt(req.params.variantItemId), req.user)

        res.status(204).json(null)
    }
}

export const productVariantControllerItem: ProductVariantControllerItem = new ProductVariantControllerItem()