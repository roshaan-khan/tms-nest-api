import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { Customer } from 'src/schemas/customer.schema';

@Injectable()
export class CustomerService {
  constructor(@InjectModel(Customer.name) private readonly customerModel: Model<Customer>) {}
  async create(createCustomerDto: Customer) {
    return await this.customerModel.create(createCustomerDto);
  }

  async findAll(filter?: FilterQuery<Customer>) {
    return await this.customerModel.find(filter);
  }

  async findOne(filter: FilterQuery<Customer>) {
    return await this.customerModel.findOne(filter).lean();
  }

  async update(id: string, updateCustomerDto: Customer, user: string) {

    const customerData = await this.findOne({ phone: updateCustomerDto.phone });

    if (!customerData) {
      throw new NotFoundException(`Customer not found`);
    }

    if (String(updateCustomerDto.user) !== user) {
      throw new ForbiddenException(`You are not authorized to update this customer`);
    }

    const customer = await this.customerModel.findByIdAndUpdate(id, updateCustomerDto, { new: true });

    return customer;
  }

  async remove(id: string, user: string) {
    const customer = await this.findOne({ _id: id });

    if (!customer) {
      throw new NotFoundException(`Customer not found`);
    }

    if (String(customer.user) !== user) {
      throw new ForbiddenException(`You are not authorized to delete this customer`);
    }

    return await this.customerModel.findByIdAndDelete(id); 
  }
}
