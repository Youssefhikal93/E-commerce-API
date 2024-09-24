import Joi from 'joi'

export const OrderSchemaCreate = Joi.object({
    addressId: Joi.number().integer().required(),
    couponCode: Joi.string().optional(),

})