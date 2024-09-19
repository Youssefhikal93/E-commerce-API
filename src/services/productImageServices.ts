import { ProductImages } from "@prisma/client";
import { Request, Response } from "express";
import { UserPayLoad } from "~/interfaces/UserInterface";
import { NotfoundException } from "~/middleWares.ts/errorMiddleware";
import { prisma } from "~/prisma";
import { productService } from "./productServices";
import { helper } from "~/utils/helpers";

class ProductImageService {

    public async addImage(productId: number, images: Express.Multer.File[], loggedUser: UserPayLoad) {

        const existingProduct = await productService.getProductById(productId)
        // helper.checkPermisson(existingProduct, loggedUser)
        helper.checkPermisson(existingProduct, 'shopId', loggedUser)

        const productImages: ProductImages[] = []

        images.map(el => {
            productImages.push({
                image: el.filename,
                productId
            } as ProductImages)
        })

        // console.log(productImages)

        const product = await prisma.productImages.createMany({
            data: productImages
        })
        return product
    }

    public async removeImages(productId: number, imageid: number, loggedUser: UserPayLoad) {

        const existingProduct = await productService.getProductById(productId)
        // helper.checkPermisson(existingProduct, loggedUser)
        helper.checkPermisson(existingProduct, 'shopId', loggedUser)

        await prisma.productImages.delete({
            where: { id: imageid }
        })


    }
}

export const productImageService = new ProductImageService()