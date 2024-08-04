import * as Joi from "joi";
import { Types } from "mongoose";

class Utils {
    checkValidMongoIdWithReq = () => Joi.string().custom((value, helpers) => {
        if (!Types.ObjectId.isValid(value)) {
            return helpers.error("custom.invalidObjectId", { message: "Invalid ObjectId value" });
        }
        return new Types.ObjectId(value);
    }).messages({ "custom.invalidObjectId": "{{#label}} must be a valid ObjectId" });
}

export default new Utils();