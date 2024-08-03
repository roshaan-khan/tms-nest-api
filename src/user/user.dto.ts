import * as Joi from "joi";
import { User } from "src/schemas/user.schema";

export const CreateUserSchema = Joi.object<User>({
    name: Joi.string().required(),
    businessName: Joi.string().required(),
    businessLogo: Joi.string().optional().allow(null),
    email: Joi.string().email().optional().allow(null),
    phone: Joi.string().required(),
    password: Joi.string().required(),
    isActive: Joi.boolean().optional().default(true),
    country: Joi.string().optional().allow(null),
    state: Joi.string().optional().allow(null),
    city: Joi.string().optional().allow(null),
})

export const loginUserSchema = Joi.object<User>({
    phone: Joi.string().required(),
    password: Joi.string().required(),
})