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
}

export default new Utils();