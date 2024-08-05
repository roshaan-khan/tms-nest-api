import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer } from 'src/schemas/customer.schema';
import { Order } from 'src/schemas/order.schema';
import { Stock } from 'src/schemas/stock.schema';
import { eClothType } from 'src/types/common.enum';
import { AVG_CLOTH_DEDUCTION_AMOUNT } from 'src/types/common.utils';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @InjectModel(Stock.name) private readonly stockModel: Model<Stock>,
    @InjectModel(Customer.name) private readonly customerModel: Model<Customer>
  ) { }
  async create(createOrderDto: Order) {
    const { stocks } = createOrderDto;

    const sizes = {}

    const clothTypes = [...Object.values(eClothType)];
    clothTypes.forEach((type) => {
      if (!createOrderDto[type]) return
      sizes[type] = { ...createOrderDto[type] }
      delete sizes[type].quantity
      delete sizes[type].total_amount
    })

    if (stocks.length > 0) {
      for (const stock of stocks) {
        const stockData = await this.stockModel.findById(stock);

        if (!stockData) {
          throw new NotFoundException(404, `Stock Not Found`);
        }

        if (stockData.quantity < AVG_CLOTH_DEDUCTION_AMOUNT[stockData.category]) {
          throw new ForbiddenException(400, `Stock ${stockData.name} is below threshold`);
        }

        await this.stockModel.findByIdAndUpdate(stock, { $inc: { quantity: -AVG_CLOTH_DEDUCTION_AMOUNT[stockData.category] } }, { new: true });
      }
    }

    const [result] = await Promise.all([
      this.orderModel.create(createOrderDto),
      this.customerModel.findByIdAndUpdate(createOrderDto.customer, { sizes }, { new: true })
    ])

    return result
  }

  async findAll() {
    return `This action returns all order`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  async update(id: number, updateOrderDto: Order) {
    return `This action updates a #${id} order`;
  }

  async remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
