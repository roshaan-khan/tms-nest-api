import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UsePipes, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { orderSchema } from './order.dto';
import { JoiValidationPipe } from 'src/pipe/joi-validation.pipe';
import { Order } from 'src/schemas/order.schema';
import Utils from 'src/utils';
import { Request } from 'express';
import { Types } from 'mongoose';
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UsePipes(new JoiValidationPipe(orderSchema))
  async create(@Body() createOrderDto: Order, @Req() req: Request) {
    createOrderDto.orderNumber = Utils.generateRandomNumber(1000, 9999).toString();
    createOrderDto.user = new Types.ObjectId(req.user.uid);
    return await this.orderService.create(createOrderDto);
  }

  @Get()
  async findAll() {
    return await this.orderService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.orderService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateOrderDto: any) {
    return await this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.orderService.remove(+id);
  }
}
