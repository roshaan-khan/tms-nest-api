import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from 'src/schemas/order.schema';
import { Stock, StockSchema } from 'src/schemas/stock.schema';
import { Customer, CustomerSchema } from 'src/schemas/customer.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }, { name: Stock.name, schema: StockSchema }, { name: Customer.name, schema: CustomerSchema }])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
