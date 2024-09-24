import Joi from 'joi'

export const reviewSchemaCreate = Joi.object({
    productId: Joi.number().integer().required(),
    rating: Joi.number().integer().required().max(10).min(1),
    comment: Joi.string().required(),
})

export const reviewSchemaUpdate = Joi.object({
    rating: Joi.number().integer().required().max(10).min(1),
    comment: Joi.string().required(),
})