import express from 'express'
import { adressController } from '~/controllers/adressController'
import { verfiyUser } from '~/middleWares.ts/authMiddlewars'
import { validateSchema } from '~/middleWares.ts/validateSchema'
import { addressSchemaCreate, addressSchemaUpdate } from '~/schemas/adressSchema'


const addressRoute = express.Router()

addressRoute.use(verfiyUser)

addressRoute.route('/')
    .post(validateSchema(addressSchemaCreate), adressController.createAdress)
    .get(adressController.getAllAddresses)

addressRoute.route('/:id')
    .patch(validateSchema(addressSchemaUpdate), adressController.updatedAddress)
    .delete(adressController.deleteAdress)


export default addressRoute