import { Controller, Get, Post, Body, Param, Delete, UseGuards, UsePipes, Req, Put, NotFoundException } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { orderSchema, updateOrderSchema, updateOrderStatusSchema } from './order.dto';
import { JoiValidationPipe } from 'src/pipe/joi-validation.pipe';
import { Order } from 'src/schemas/order.schema';
import { Request } from 'express';
import { Types } from 'mongoose';
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post()
  @UsePipes(new JoiValidationPipe(orderSchema))
  async create(@Body() createOrderDto: Order, @Req() req: Request) {
    createOrderDto.user = new Types.ObjectId(req.user.uid);
    const order = await this.orderService.create(createOrderDto);
    return { msg: 'Order created successfully', data: order };
  }

  @Get()
  async findAll(@Req() req: Request) {
    const status = req.query.status;
    const offset = Number(req.query.offSet) || 10;
    const page = Number(req.query.page) || 1;

    const query = status ? { status } : {};
    const { total, orders } =  await this.orderService.findAll(query, { offset, page });

    return { data: orders, total };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const order = await this.orderService.findOne(id);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return { data: order };
  }

  @Put(':id')
  @UsePipes(new JoiValidationPipe(updateOrderSchema))
  async update(@Param('id') id: string, @Body() updateOrderDto: Order, @Req() req: Request) {
    const updatedOrder = await this.orderService.update(id, updateOrderDto, req.user.uid);

    if (!updatedOrder) {
      throw new NotFoundException('Order not found');
    }

    return { msg: 'Order updated successfully', updatedOrder };
  }

  @Put('status/:id')
  @UsePipes(new JoiValidationPipe(updateOrderStatusSchema))
  async updateStatus(@Param('id') id: string, @Body() body: { status: Order['status']}, @Req() req: Request) {
    const updatedOrder = await this.orderService.updateStatus(id, body.status);

    if (!updatedOrder) {
      throw new NotFoundException('Order not found');
    }

    return { msg: 'Status updated successfully', updatedOrder };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.orderService.remove(+id);
  }
}
