import express from 'express'
import { productImagesController } from '~/controllers/productImages'
import { restrictTo, verfiyUser } from '~/middleWares.ts/authMiddlewars'
import { upload } from '~/utils/uploads'


const productImageRoute = express.Router()

productImageRoute.post('/:id',
    verfiyUser,
    restrictTo('ADMIN', 'SHOP'),
    upload.array('images', 5),
    productImagesController.CreateImages)



productImageRoute.delete('/:productId/:imageId',
    verfiyUser,
    restrictTo('ADMIN', 'SHOP')
    , productImagesController.deleteImage)


export default productImageRoute