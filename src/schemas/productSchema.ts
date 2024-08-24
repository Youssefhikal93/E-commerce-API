import Joi from 'joi'

export const productSchemaCreate = Joi.object({
    name: Joi.string().required(),
    longDescription: Joi.string().required(),
    shortDescription: Joi.string().required(),
    quantity: Joi.number().integer().required(),
    main_image: Joi.optional(),
    categoryId: Joi.number().integer().required(),
    price: Joi.number().required(),
    // shopId: Joi.number().required()
})
