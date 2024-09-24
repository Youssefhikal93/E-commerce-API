import Joi from 'joi'

export const couponSchemaCreate = Joi.object({
    discountType: Joi.string(),
    discountPrice: Joi.number().integer().required(),
    code: Joi.string().required()
})

