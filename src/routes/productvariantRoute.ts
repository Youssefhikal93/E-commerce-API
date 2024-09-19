import express from 'express'
import { productController } from '~/controllers/productController'
import { productImagesController } from '~/controllers/productImages'
import { productVariantController } from '~/controllers/productVariantController'
import { restrictTo, verfiyUser } from '~/middleWares.ts/authMiddlewars'
import { upload } from '~/utils/uploads'


const productVariantRoute = express.Router()

productVariantRoute.post('/:id',
    verfiyUser,
    restrictTo('ADMIN', 'SHOP'),
    // upload.array('images', 5),
    productVariantController.createVaraint)



productVariantRoute.delete('/:productId/:variantId',
    verfiyUser,
    restrictTo('ADMIN', 'SHOP')
    , productVariantController.deleteVaraint)


export default productVariantRoute