import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UsePipes, UseInterceptors, UploadedFile } from '@nestjs/common';
import { StockService } from './stock.service';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { JoiValidationPipe } from 'src/pipe/joi-validation.pipe';
import { stockSchema } from './stock.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { File } from 'buffer';
import { Stock } from 'src/schemas/stock.schema';

@UseGuards(JwtAuthGuard)
@Controller('stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post()
  @UsePipes(new JoiValidationPipe(stockSchema))
  @UseInterceptors(FileInterceptor('stocks'))
  create(@Body() createStockDto: Stock, @UploadedFile() file: File) {
    return this.stockService.create(createStockDto, file);
  }

  @Get()
  findAll() {
    return this.stockService.findAll();
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
