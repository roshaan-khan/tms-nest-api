import { Types } from "mongoose";

export interface IPayload {
    uid: Types.ObjectId;
    email: string;
    phone: string;
    name: string;
}