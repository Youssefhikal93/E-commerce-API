import { Request, Response } from "express";
import { productImageService } from "~/services/productImageServices";
import parseAndValidateId from "~/utils/parseAndValidateId";

class ProductImagesController {

    public async CreateImages(req: Request, res: Response) {
        const id = parseAndValidateId(req)

        const files = req.files as Express.Multer.File[]

        await productImageService.addImage(id, files, req.user)

        return res.status(201).json({
            status: 'succsses',
            message: 'Images uploaded'

        })

    }
    public async deleteImage(req: Request, res: Response) {


        await productImageService.removeImages(parseInt(req.params.productId), parseInt(req.params.imageId), req.user)

        return res.status(204).json(null)

    }

}

export const productImagesController = new ProductImagesController()