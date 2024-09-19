import { Request, Response } from "express";
import { productvarinatService } from "~/services/productVaraintServices";
import parseAndValidateId from "~/utils/parseAndValidateId";

class ProductVariantController {

    public async createVaraint(req: Request, res: Response) {
        const id = parseAndValidateId(req)
        const variant = await productvarinatService.add(id, req.body, req.user)

        res.status(201).json({
            status: "Sucsses",
            data: {
                variant
            }
        })
    }
    public async deleteVaraint(req: Request, res: Response) {

        await productvarinatService.remove(parseInt(req.params.productId), parseInt(req.params.variantId), req.user)

        res.status(204).json(null)
    }
}

export const productVariantController: ProductVariantController = new ProductVariantController()