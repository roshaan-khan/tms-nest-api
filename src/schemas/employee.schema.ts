import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { eSalaryType } from 'src/types/common.enum';
import { COLLECTION } from './collectionNames';
import { User } from './user.schema';

export type EmployeeDocument = HydratedDocument<Employee>;

@Schema({ timestamps: true, collection: COLLECTION.EMPLOYEE })
export class Employee {

    _id: Types.ObjectId;
    
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    designation: string;
    
    @Prop({ required: true })
    phone: string;
    
    @Prop({ required: true })
    salary: string;

    @Prop({ enum: Object.values(eSalaryType), required: true })
    salaryType: string;
    
    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    employeeOf: Types.ObjectId;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);