import Joi from 'joi'

export const categorySchemaCreate = Joi.object({
  name: Joi.string().required(),
  icon: Joi.string().required()
})
