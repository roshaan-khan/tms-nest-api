import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { COLLECTION } from './collectionNames';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true, collection: COLLECTION.USER })
export class User {

    _id: Types.ObjectId;
    
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    email: string;

    @Prop({ default: null })
    profilePicture: string;

    @Prop({ required: true })
    phone: string;
    
    @Prop({ required: true })
    password: string;

    // @Prop({ default: true })
    // isActive: boolean;   
}

export const UserSchema = SchemaFactory.createForClass(User);