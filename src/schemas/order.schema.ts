import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { eClothType, eOrderStatus, eSalaryType } from 'src/types/common.enum';
import { COLLECTION } from './collectionNames';
import { Customer } from './customer.schema';
import { Employee } from './employee.schema';
import { User } from './user.schema';
import { Stock } from './stock.schema';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true, collection: COLLECTION.ORDER })
export class Order {

    _id: Types.ObjectId;
    
    @Prop({ required: true })
    orderNumber: string;

    @Prop({ required: false, default: null, type: Object })
    [eClothType.KAMEEZ_AND_SHALWAR]: any;

    @Prop({ required: false, default: null, type: Object })
    [eClothType.SHIRT_AND_PANT]: object;

    @Prop({ required: false, default: null, type: Object })
    [eClothType.COAT]: object;

    @Prop({ required: false, default: null, type: Object })
    [eClothType.WAIST_COAT]: object;

    @Prop({ required: false, default: null, type: Object })
    [eClothType.SHERWANI]: object;

    @Prop({ required: true, default: eOrderStatus.PENDING, enum: Object.values(eOrderStatus) })
    status: string;

    @Prop({ type: Types.ObjectId, required: true, ref: Customer.name })
    customer: Types.ObjectId;

    @Prop({ type: Array<string>, required: false, default: [] })
    designCodes: Array<string>;

    @Prop({ type: Date, required: true })
    currentDate: Date;

    @Prop({ type: Date, required: true })
    deliveryDate: Date;

    @Prop({ type: Array<eClothType>, required: true, default: [eClothType.KAMEEZ_AND_SHALWAR], enum: Object.values(eClothType) })
    clothType: Array<eClothType>;

    @Prop({ type: Number, required: false, default: 0 })
    advance_amount: number;

    @Prop({ type: Types.ObjectId, required: true, ref: Employee.name })
    assignedLabor: Types.ObjectId;

    @Prop({ type: Types.ObjectId, required: true, ref: User.name })
    user: Types.ObjectId;

    @Prop({ type: Array<Types.ObjectId>, required: false, ref: Stock.name, default: [] })
    stocks: Array<Types.ObjectId>;

    @Prop({ type: Number, required: true, default: 0 })
    grossAmount: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);