import express from 'express'
import { productVariantControllerItem } from '~/controllers/productVariantItemController'
import { restrictTo, verfiyUser } from '~/middleWares.ts/authMiddlewars'

const productVariantItemRoute = express.Router()

productVariantItemRoute.post('/:productId/:variantId',
    verfiyUser,
    restrictTo('ADMIN', 'SHOP'),
    productVariantControllerItem.createItem)



productVariantItemRoute.delete('/:productId/:variantId/:variantItemId',
    verfiyUser,
    restrictTo('ADMIN', 'SHOP')
    , productVariantControllerItem.deleteItem)


export default productVariantItemRoute