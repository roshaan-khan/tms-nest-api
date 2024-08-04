import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderService {
  async create(createOrderDto: any) {
    return 'This action adds a new order';
  }

  async findAll() {
    return `This action returns all order`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  async update(id: number, updateOrderDto: any) {
    return `This action updates a #${id} order`;
  }

  async remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
