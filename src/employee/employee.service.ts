import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { Employee } from 'src/schemas/employee.schema';

@Injectable()
export class EmployeeService {
  constructor(@InjectModel(Employee.name) private readonly employeeModel: Model<Employee>) { }
  async create(createEmployeeDto: Employee) {
    return this.employeeModel.create(createEmployeeDto);
  }

  async findAll(filter?: FilterQuery<Employee>) {
    return this.employeeModel.find(filter)
  }

  async findOne(id: Types.ObjectId) {
    return this.employeeModel.findById(id)
  }

  update(id: number, updateEmployeeDto: Employee) {
    return `This action updates a #${id} employee`;
  }

  remove(id: number) {
    return `This action removes a #${id} employee`;
  }
}
