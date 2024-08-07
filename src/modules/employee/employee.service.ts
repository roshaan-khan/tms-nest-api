import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { Employee } from 'src/schemas/employee.schema';
import { IContext } from 'src/types/common.interface';

@Injectable()
export class EmployeeService {
  constructor(@InjectModel(Employee.name) private readonly employeeModel: Model<Employee>) { }
  async create(createEmployeeDto: Employee) {
    return this.employeeModel.create(createEmployeeDto);
  }

  async findAll(filter?: FilterQuery<Employee>, context?: IContext) {
    const { offset, page } = context;
    const skip = offset * page - offset;
    const [employees, total] = await Promise.all([
      this.employeeModel.find(filter).limit(offset).skip(skip).lean(),
      this.employeeModel.countDocuments(filter)
    ]);

    return { employees, total }
  }

  async findOne(id: Types.ObjectId) {
    return await this.employeeModel.findById(id)
  }

  async update(id: string, updateEmployeeDto: Employee, user_id: string) {
    const result = await this.employeeModel.findByIdAndUpdate(id, updateEmployeeDto, { new: true });

    if (!result) {
      throw new NotFoundException('Employee not found');
    }

    if (String(result.employeeOf) !== user_id) {
      throw new UnauthorizedException(`You are not allowed to update this Employee`);
    }

    return result;
  }

  async remove(id: string) {
    const employee = await this.employeeModel.findByIdAndDelete(id);

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return employee;
  }
}
