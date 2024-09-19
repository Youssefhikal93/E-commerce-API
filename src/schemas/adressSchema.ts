import Joi from 'joi'

export const addressSchemaCreate = Joi.object({
    country: Joi.string().required(),
    postalCode: Joi.number().required(),
    street: Joi.string().required(),
    province: Joi.string().required()
})

export const addressSchemaUpdate = Joi.object({
    country: Joi.string().optional(),
    postalCode: Joi.number().integer().optional(),
    street: Joi.string().optional(),
    province: Joi.string().optional()
})
