import * as Joi from "joi"
import { Customer } from "src/schemas/customer.schema";
import utils from "src/utils";

const sizeSchema = Joi.object({
    KAMEEZ_AND_SHALWAR: Joi.object(),
    COAT: Joi.object(),
    SHERWANI: Joi.object(),
    SHIRT_AND_PANT: Joi.object(),
    WAIST_COAT: Joi.object(),
})

export const customerSchema = Joi.object<Customer>({
    name: Joi.string().required(),
    phone: Joi.string().required().min(11).max(11),
    sizes: sizeSchema,
});

export const updatecustomerSchema = Joi.object<Customer>({
    name: Joi.string().required(),
    phone: Joi.string().required().min(11).max(11),
    sizes: sizeSchema,
    user: utils.checkValidMongoIdWithReq(),
});