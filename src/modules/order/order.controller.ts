import { Controller, Get, Post, Body, Param, Delete, UseGuards, UsePipes, Req, Put, NotFoundException } from '@nestjs/common';
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
    createOrderDto.user = new Types.ObjectId(req.user.uid);
    const order = await this.orderService.create(createOrderDto);
    return { msg: 'Order created successfully', order };
  }

  @Get()
  async findAll() {
    return await this.orderService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.orderService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateOrderDto: any, @Req() req: Request) {
    const updatedOrder = await this.orderService.update(id, updateOrderDto, req.user.uid);

    if (!updatedOrder) {
      throw new NotFoundException('Order not found');
    }

    return { msg: 'Order updated successfully', updatedOrder };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.orderService.remove(+id);
  }
}
