import { ProductVariantItem } from "@prisma/client"
import { UserPayLoad } from "~/interfaces/UserInterface"
import { productService } from "./productServices"
import { helper } from "~/utils/helpers"
import { prisma } from "~/prisma"
import { NotfoundException } from "~/middleWares.ts/errorMiddleware"
import { ProductVriantBody } from "~/interfaces/productVariantInterface"

class ProductvarinatServiceItem {
    public async add(productId: number, variantId: number, requestedBody: ProductVriantBody, loggedUser: UserPayLoad): Promise<ProductVariantItem> {

        const existingProduct = await productService.getProductById(productId)
        // helper.checkPermisson(existingProduct, loggedUser)
        helper.checkPermisson(existingProduct, 'shopId', loggedUser)

        const { name } = requestedBody
        const variantItem = await prisma.productVariantItem.create({
            data: {
                name,
                variantId
            }
        })
        return variantItem
    }

    public async remove(productId: number, variantId: number, variantItemId: number, loggedUser: UserPayLoad) {
        const existingProduct = await productService.getProductById(productId)
        // helper.checkPermisson(existingProduct, loggedUser)
        helper.checkPermisson(existingProduct, 'shopId', loggedUser)


        const variant = await prisma.productVariant.findFirst({
            where: {
                id: variantId,
                productId: productId, // Additional validation to ensure the variant belongs to the correct product
            },
            include: {
                ProductVariantItem: true // Include related ProductVariantItems
            }
        });

        if (!variant) {
            throw new NotfoundException(`Variant ID:${variantId} not found for Product ID:${productId}`);
        }

        // Ensure the related items were fetched as an array
        const productVariantItems = variant!.ProductVariantItem;

        // Validate if the variant item exists within the fetched items
        const variantItemExists = productVariantItems.find(item => item.id === variantItemId);

        // Check if the variant item exists in the array
        if (!variantItemExists) {
            throw new NotfoundException(`Variant Item ID:${variantItemId} not found in Variant ID:${variantId}`);
        }

        // Delete the variant item if all validations pass
        await prisma.productVariantItem.delete({
            where: { id: variantItemId }
        });



    }
}

export const productvarinatServiceItem: ProductvarinatServiceItem = new ProductvarinatServiceItem()