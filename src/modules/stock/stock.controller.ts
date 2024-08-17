import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UsePipes, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import { StockService } from './stock.service';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { JoiValidationPipe } from 'src/pipe/joi-validation.pipe';
import { stockSchema } from './stock.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { File } from 'buffer';
import { Stock } from 'src/schemas/stock.schema';
import { Request } from 'express';
import { Types } from 'mongoose';

@UseGuards(JwtAuthGuard)
@Controller('stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post()
  @UsePipes(new JoiValidationPipe(stockSchema))
  @UseInterceptors(FileInterceptor('stocks', { limits: { fileSize: 1024 * 1024 * 5 } }))
  async create(@Body() createStockDto: Stock, @UploadedFile() file: File, @Req() req: Request) {
    createStockDto.user = new Types.ObjectId(req.user.uid);
    const result = await this.stockService.create(createStockDto, file);
    return { msg: 'Stock created successfully', data: result };
  }

  @Get()
  async findAll(@Req() req: Request) {
    const offset = Number(req.query.offSet) || 10;
    const page = Number(req.query.page) || 1;
    const category = req.query.category;

    const query = { user: new Types.ObjectId(req.user.uid) };
    if (category) query['category'] = category;

    const { stocks, total } = await this.stockService.findAll(query, { offset, page });
    return { msg: '', data: stocks, total };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStockDto: Stock) {
    return this.stockService.update(id, updateStockDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stockService.remove(id);
  }
}
