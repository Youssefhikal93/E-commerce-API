import express from 'express'
import { productController } from '~/controllers/productController'
import { validateSchema } from '~/middleWares.ts/validateSchema'
import { productSchemaCreate } from '~/schemas/productSchema'
import { restrictTo, verfiyUser } from "../middleWares.ts/authMiddlewars"
import { upload } from '~/utils/uploads'



const productRoute = express.Router()
productRoute.get('/me', verfiyUser, restrictTo('ADMIN', 'SHOP'), productController.getMyProducts)

productRoute.route('/')
    .get(productController.getAll)
    .post(verfiyUser,
        restrictTo('ADMIN', 'SHOP'),
        upload.single('main_image'),
        validateSchema(productSchemaCreate),
        productController.createOne)

productRoute.route('/:id')
    .get(productController.getOne)
    .put(verfiyUser, restrictTo('ADMIN', 'SHOP'), upload.single('main_image'), validateSchema(productSchemaCreate), productController.updateOne)
    .delete(verfiyUser, restrictTo('ADMIN', 'SHOP'), productController.deleteOne)



export default productRoute