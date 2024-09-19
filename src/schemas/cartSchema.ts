import Joi from "joi";

export const cartSchemaUpdate = Joi.object({
    productId: Joi.number().integer().required(),
    quantity: Joi.number().integer().optional(),
    variant: Joi.string().optional(),

})