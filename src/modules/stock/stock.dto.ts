import * as Joi from 'joi';
import { eClothType } from 'src/types/common.enum';

export const stockSchema = Joi.object({
    name: Joi.string().required(),
    category: Joi.string().required().valid(...Object.values(eClothType)),
    quantity: Joi.number().optional().allow(null).default(1),
    fileName: Joi.any().optional(),
});