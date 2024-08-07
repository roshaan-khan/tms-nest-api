import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { Customer } from 'src/schemas/customer.schema';
import { Order } from 'src/schemas/order.schema';
import { Stock } from 'src/schemas/stock.schema';
import { eClothType } from 'src/types/common.enum';
import { IContext } from 'src/types/common.interface';
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

    const orderCount = await this.orderModel.countDocuments({ user: createOrderDto.user });
    createOrderDto.orderNumber = `ORD-${(orderCount + 1).toString().padStart(4, '0')}`;
    createOrderDto.user = new Types.ObjectId(createOrderDto.user);
    createOrderDto.assignedLabor = new Types.ObjectId(createOrderDto.assignedLabor);
    createOrderDto.customer = new Types.ObjectId(createOrderDto.user);

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

  async findAll(filter?: FilterQuery<Order>, context?: IContext) {
    const { offset, page } = context;
    const skip = offset * page - offset;

    const [orders, total] = await Promise.all([
      this.orderModel.find(filter).limit(offset).skip(skip).lean(),
      this.orderModel.countDocuments(filter)
    ]);

    return { orders, total }
  }

  async findOne(id: string) {
    return await this.orderModel.findById(id);
  }

  async update(id: string, updateOrderDto: Order, userId: string) {

    if (String(updateOrderDto.user) !== userId) {
      throw new ForbiddenException(403, `You are not allowed to update this Order`);
    }

    const { stocks } = updateOrderDto;
    const clothTypes = [...Object.values(eClothType)];
    updateOrderDto.user = new Types.ObjectId(updateOrderDto.user);
    updateOrderDto.assignedLabor = new Types.ObjectId(updateOrderDto.assignedLabor);
    updateOrderDto.customer = new Types.ObjectId(updateOrderDto.user);

    const sizes = {}

    clothTypes.forEach((type) => {
      if (!updateOrderDto[type]) return
      sizes[type] = { ...updateOrderDto[type] }
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
      this.orderModel.findByIdAndUpdate(id, updateOrderDto, { new: true }),
      this.customerModel.findByIdAndUpdate(updateOrderDto.customer, { sizes }, { new: true })
    ])

    return result
  }

  async updateStatus(id: string, status: Order['status']) {
    return await this.orderModel.findByIdAndUpdate(id, { status }, { new: true });
  }

  async remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
