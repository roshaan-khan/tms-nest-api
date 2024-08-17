import * as Joi from "joi";
import { Types } from "mongoose";
import { randomInt } from "crypto"
import { Request } from "express";
import { eS3AssetsFolder } from "src/types/common.interface";

class Utils {
    checkValidMongoIdWithReq = () => Joi.string().custom((value, helpers) => {
        if (!Types.ObjectId.isValid(value)) {
            return helpers.error("custom.invalidObjectId", { message: "Invalid ObjectId value" });
        }
        return new Types.ObjectId(value);
    }).messages({ "custom.invalidObjectId": "{{#label}} must be a valid ObjectId" });

    generateRandomNumber = (min: number, max: number) => randomInt(min, max);

    generateS3FileName = (req: Request, folderName: string) => {
        if (folderName === eS3AssetsFolder.USER_PROFILE) {
            return req.user?.uid;
        }
        return Date.now();
    }

    generateStockCode = (category: string, count: number) => {
        const charCode = category.slice(0, 2).toUpperCase();
        const countNumber = count.toString().padStart(4, "0");

        const code = `${charCode}${countNumber}`;

        return code;
    };
}

export default new Utils();