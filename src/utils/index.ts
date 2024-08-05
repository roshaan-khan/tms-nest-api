import * as Joi from "joi";
import { Types } from "mongoose";
import { randomInt } from "crypto"

class Utils {
    checkValidMongoIdWithReq = () => Joi.string().custom((value, helpers) => {
        if (!Types.ObjectId.isValid(value)) {
            return helpers.error("custom.invalidObjectId", { message: "Invalid ObjectId value" });
        }
        return new Types.ObjectId(value);
    }).messages({ "custom.invalidObjectId": "{{#label}} must be a valid ObjectId" });

    generateRandomNumber = (min: number, max: number) => randomInt(min, max);
}

export default new Utils();