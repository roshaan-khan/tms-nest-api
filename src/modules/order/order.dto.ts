import * as Joi from "joi";
import { eClothType, eOrderStatus } from "src/types/common.enum";
import Utils from '../../utils'
import { Order } from "src/schemas/order.schema";

const quantityAndTotalAmountSchema = {
    quantity: Joi.number().optional().allow("", null),
    total_amount: Joi.number().required(),
}

const pantAndShirtSchema = {
    shirtLength: Joi.string().optional().allow("", null),
    shirtSleeves: Joi.string().optional().allow("", null),
    shirtShoulder: Joi.string().optional().allow("", null),
    shirtChest: Joi.string().optional().allow("", null),
    shirtCollar: Joi.string().optional().allow("", null),
    shirtLoosing: Joi.string().optional().allow("", null),
    shirtHip: Joi.string().optional().allow("", null),
    pantLength: Joi.string().optional().allow("", null),
    pantWaist: Joi.string().optional().allow("", null),
    pantHip: Joi.string().optional().allow("", null),
    pantThigh: Joi.string().optional().allow("", null),
    pantFly: Joi.string().optional().allow("", null),
    pantBottom: Joi.string().optional().allow("", null),
    ...quantityAndTotalAmountSchema
}

const kameezAndShalwarSchema = {
    kameezLength: Joi.string().optional().allow("", null),
    kameezSleeves: Joi.string().optional().allow("", null),
    kameezShoulder: Joi.string().optional().allow("", null),
    kameezChest: Joi.string().optional().allow("", null),
    kameezCollar: Joi.string().optional().allow("", null),
    kameezLoosing: Joi.string().optional().allow("", null),
    kameezHip: Joi.string().optional().allow("", null),
    kameezDaman: Joi.string().optional().allow("", null),
    shalwarLength: Joi.string().optional().allow("", null),
    shalwarBottom: Joi.string().optional().allow("", null),
    ...quantityAndTotalAmountSchema
}

const coatSchema = {
    coatLength: Joi.string().optional().allow("", null),
    coatChest: Joi.string().optional().allow("", null),
    coatWaist: Joi.string().optional().allow("", null),
    coatHip: Joi.string().optional().allow("", null),
    coatShoulder: Joi.string().optional().allow("", null),
    coatCollar: Joi.string().optional().allow("", null),
    coatOffBag: Joi.string().optional().allow("", null),
    ...quantityAndTotalAmountSchema
}

const waistCoatSchema = {
    waistCoatLength: Joi.string().optional().allow("", null),
    waistCoatChest: Joi.string().optional().allow("", null),
    waistCoatWaist: Joi.string().optional().allow("", null),
    waistCoatHip: Joi.string().optional().allow("", null),
    waistCoatShoulder: Joi.string().optional().allow("", null),
    waistCoatCollar: Joi.string().optional().allow("", null),
    ...quantityAndTotalAmountSchema
}

const sherwaniSchema = {
    sherwaniLength: Joi.string().optional().allow("", null),
    sherwaniChest: Joi.string().optional().allow("", null),
    sherwaniWaist: Joi.string().optional().allow("", null),
    sherwaniHip: Joi.string().optional().allow("", null),
    sherwaniShoulder: Joi.string().optional().allow("", null),
    sherwaniCollar: Joi.string().optional().allow("", null),
    sherwaniOffBag: Joi.string().optional().allow("", null),
    sherwaniKhussa: Joi.string().optional().allow("", null),
    sherwaniPagri: Joi.string().optional().allow("", null),
    ...quantityAndTotalAmountSchema
}

const schema = {
    [eClothType.KAMEEZ_AND_SHALWAR]: Joi.object(kameezAndShalwarSchema).optional(),
    [eClothType.COAT]: Joi.object(coatSchema).optional(),
    [eClothType.WAIST_COAT]: Joi.object(waistCoatSchema).optional(),
    [eClothType.SHIRT_AND_PANT]: Joi.object(pantAndShirtSchema).optional(),
    [eClothType.SHERWANI]: Joi.object(sherwaniSchema).optional(),
    designCodes: Joi.array().items(Joi.string()).optional().allow("", null),
    stocks: Joi.array().items(Utils.checkValidMongoIdWithReq()).optional().allow("", null),
    status: Joi.string().optional().valid(...Object.values(eOrderStatus)).default(eOrderStatus.PENDING),
    currentDate: Joi.date().required(),
    deliveryDate: Joi.date().required(),
    assignedLabor: Utils.checkValidMongoIdWithReq().required(),
    customer: Utils.checkValidMongoIdWithReq().required(),
    advance_amount: Joi.number().optional().default(0).allow("", null),
    grossAmount: Joi.number().required(),
}

export const orderSchema = Joi.object<Order>(schema);

export const updateOrderSchema = Joi.object<Order>({
    ...schema,
    orderNumber: Joi.string().optional().allow("", null),
    user: Utils.checkValidMongoIdWithReq().optional().allow("", null),
    clothType: Joi.array().items(Joi.string().valid(...Object.values(eClothType))).optional().allow("", null),
})

export const updateOrderStatusSchema = Joi.object({
    status: Joi.string().required().valid(...Object.values(eOrderStatus))
})
