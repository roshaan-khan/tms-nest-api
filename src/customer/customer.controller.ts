import { Controller, Get, Post, Body, Param, Delete, ConflictException, UseGuards, Req, Put, UsePipes } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Customer } from 'src/schemas/customer.schema';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { Request } from 'express';
import { Types } from 'mongoose';
import { JoiValidationPipe } from 'src/pipe/joi-validation.pipe';
import { customerSchema, updatecustomerSchema } from './customer.dto';

@UseGuards(JwtAuthGuard)
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @UsePipes(new JoiValidationPipe(customerSchema))
  async create(@Body() createCustomerDto: Customer, @Req() req: Request) {
    
    const { phone } = createCustomerDto;

    const isExists = await this.customerService.findOne({ phone });

    if (isExists) {
      throw new ConflictException(`Customer with phone ${phone} already exists`);
    }

    createCustomerDto.user = new Types.ObjectId(req.user.uid);

    const customer = await this.customerService.create(createCustomerDto);

    return { msg: 'Customer created successfully', data: customer };
  }

  @Get()
  async findAll(@Req() req: Request) {
    const customers = await this.customerService.findAll({ user: new Types.ObjectId(req.user.uid) });
    return { data: customers };
  }

  @Get(':phone')
  async findOne(@Param('phone') phone: string) {
    const customerData = await this.customerService.findOne({ phone });

    if (!customerData) {
      throw new ConflictException(`Customer with phone ${phone} not found`);
    }

    return { msg: '', data: { ...customerData } };
  }
  
  @Put(':id')
  @UsePipes(new JoiValidationPipe(updatecustomerSchema))
  async update(@Param('id') id: string, @Body() updateCustomerDto: Customer, @Req() req: Request) {
    const customer = await this.customerService.update(id, updateCustomerDto, req.user.uid);  
    return { msg: 'Customer updated successfully', data: customer };
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request) {
    await this.customerService.remove(id, req.user.uid);
    return { msg: 'Customer deleted successfully' };
  }
}
