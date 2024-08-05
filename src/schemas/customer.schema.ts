import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { eClothType } from 'src/types/common.enum';
import { COLLECTION } from './collectionNames';

export type CustomerDocument = HydratedDocument<Customer>;

class Size {
  @Prop({ type: Object })
  [eClothType.KAMEEZ_AND_SHALWAR]: object;

  @Prop({ type: Object })
  [eClothType.COAT]: object;

  @Prop({ type: Object })
  [eClothType.SHERWANI]: object;

  @Prop({ type: Object })
  [eClothType.SHIRT_AND_PANT]: object;

  @Prop({ type: Object })
  [eClothType.WAIST_COAT]: object;
}

@Schema({ timestamps: true, collection: COLLECTION.CUSTOMER })
export class Customer {
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ type: Size, required: true })
  sizes: Size;

  @Prop({ type: Types.ObjectId, ref: COLLECTION.USER, required: true })
  user: Types.ObjectId;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
