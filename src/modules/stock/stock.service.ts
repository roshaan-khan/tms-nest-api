import { Injectable } from '@nestjs/common';
import { File } from 'buffer';
import { Stock } from 'src/schemas/stock.schema';

@Injectable()
export class StockService {
  create(createStockDto: Stock, file: File) {
    return 'This action adds a new stock';
  }

  findAll() {
    return `This action returns all stock`;
  }

  findOne(id: string) {
    return `This action returns a #${id} stock`;
  }

  update(id: string, updateStockDto: Stock) {
    return `This action updates a #${id} stock`;
  }

  remove(id: string) {
    return `This action removes a #${id} stock`;
  }
}
