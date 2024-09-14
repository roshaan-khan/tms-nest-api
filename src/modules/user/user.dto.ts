import * as Joi from "joi";
import { User } from "src/schemas/user.schema";

export const CreateUserSchema = Joi.object<User>({
    name: Joi.string().required(),
    profilePicture: Joi.string().optional().allow(null),
    email: Joi.string().email().optional().allow(null),
    phone: Joi.string().required(),
    password: Joi.string().required(),
})

export const loginUserSchema = Joi.object<{ emailOrPhone: string; password: string;  }>({
    emailOrPhone: Joi.string().required(),
    password: Joi.string().required(),
})