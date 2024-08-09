import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { eClothType } from 'src/types/common.enum';
import { COLLECTION } from './collectionNames';
import { User } from './user.schema';

export type StockDocument = HydratedDocument<Stock>;

@Schema({ timestamps: true, collection: COLLECTION.STOCK })
export class Stock {

    _id: Types.ObjectId;
    
    @Prop({ required: true })
    code: string;

    @Prop({ required: true })
    name: string;
    
    @Prop({ required: true, enum: Object.values(eClothType) })
    category: string;
    
    @Prop({ required: true, default: 0 })
    quantity: number;

    @Prop({ required: true, type: Array<String> })
    images: string[];
    
    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    user: Types.ObjectId;
}

export const StockSchema = SchemaFactory.createForClass(Stock);