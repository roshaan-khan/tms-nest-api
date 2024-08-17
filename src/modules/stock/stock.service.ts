import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Stock } from 'src/schemas/stock.schema';
import { S3Service } from 'src/services/awsS3.service';
import { IContext } from 'src/types/common.interface';
import Utils from 'src/utils';

@Injectable()
export class StockService {
  constructor(@InjectModel(Stock.name) private readonly stockModel: Model<Stock>, private readonly s3Service: S3Service) {}
  async create(createStockDto: Stock, files: any) {
    const { category } = createStockDto;
    console.log(files)
    const stockCount = await this.stockModel.countDocuments({ category });
    createStockDto.code = Utils.generateStockCode(category, stockCount + 1);

    let images: string[] = [];

    if (files.length > 0) {
      files.forEach((f: any) => {
        const url = `${this.s3Service.s3URL}/${f.key}`;
        images.push(url);
      });
    }

    createStockDto.images = images;
    const result = {};

    return result;
  }

  async findAll(query: FilterQuery<Stock>, context: IContext) {
    const { offset, page } = context;
    const skip = offset * page - offset;
    const [stocks, total] = await Promise.all([
      this.stockModel.find(query).limit(offset).skip(skip).sort({ createdAt: -1 }),
      this.stockModel.countDocuments(query)
    ]);
    return { stocks, total }; 
  }

  async findOne(id: string) {
    return await `This action returns a #${id} stock`;
  }

  async update(id: string, updateStockDto: Stock) {
    return await `This action updates a #${id} stock`;
  }

  async remove(id: string) {
    return await `This action removes a #${id} stock`;
  }
}
