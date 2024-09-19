import { Product, ProductVariant } from "@prisma/client"
import { UserPayLoad } from "~/interfaces/UserInterface"
import { prisma } from "~/prisma"
import { productService } from "./productServices"
import { helper } from "~/utils/helpers"
import { ProductVriantBody } from "~/interfaces/productVariantInterface"
import { NotfoundException } from "~/middleWares.ts/errorMiddleware"

class ProductvarinatService {
    public async add(productId: number, requestedBody: ProductVriantBody, loggedUser: UserPayLoad): Promise<ProductVariant> {

        const existingProduct = await productService.getProductById(productId)
        // helper.checkPermisson(existingProduct, loggedUser)
        helper.checkPermisson(existingProduct, 'shopId', loggedUser)


        const { name } = requestedBody
        const variant = await prisma.productVariant.create({
            data: {
                name,
                productId
            }
        })
        return variant
    }

    public async remove(productId: number, variantId: number, loggedUser: UserPayLoad) {
        const existingProduct = await productService.getProductById(productId)
        // helper.checkPermisson(existingProduct, loggedUser)
        helper.checkPermisson(existingProduct, 'shopId', loggedUser)

        const product = await prisma.product.findFirst({
            where: {
                id: productId
            },
            include: {
                ProductVariant: true
            }
        })

        if (!product) {
            throw new NotfoundException(`Produt with ID:${productId} not found`)
        }


        const exisitingVariant = product.ProductVariant.find(el => el.id === variantId)

        if (!exisitingVariant) {
            throw new NotfoundException(`variant with ID:${variantId} not found with product:${productId}`)
        }

        await prisma.productVariant.delete({
            where: { id: variantId }
        })
    }
}

export const productvarinatService: ProductvarinatService = new ProductvarinatService()