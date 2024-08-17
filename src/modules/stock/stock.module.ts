import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Stock, StockSchema } from 'src/schemas/stock.schema';
import { S3Service } from 'src/services/awsS3.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Stock.name, schema: StockSchema }])],
  controllers: [StockController],
  providers: [StockService, S3Service],
})
export class StockModule {}
