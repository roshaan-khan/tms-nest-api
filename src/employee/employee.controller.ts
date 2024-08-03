import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, UsePipes, ConflictException, Req } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { Employee } from 'src/schemas/employee.schema';
import { JoiValidationPipe } from 'src/pipe/joi-validation.pipe';
import { employeeSchema } from './employee.dto';
import { Types } from 'mongoose';
import { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}
  private readonly ModuleName = 'Employee'

  @Post()
  @UsePipes(new JoiValidationPipe(employeeSchema))
  async create(@Req() req: Request) {
    const createEmployeeDto = { ...req.body, employeeOf: new Types.ObjectId(req.user.uid) }

    const employee = await this.employeeService.create(createEmployeeDto)

    return { msg: `${this.ModuleName} created Successfully`, data: employee }

  }

  @Get()
  async findAll(@Req() req: Request) {
    const employees = this.employeeService.findAll({ employeeOf: new Types.ObjectId(req.user.uid) });
    return { msg: '', data: employees }
  }

  @Get(':id')
  findOne(@Param('id') id: Types.ObjectId) {
    return this.employeeService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateEmployeeDto: Employee) {
    return this.employeeService.update(+id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeService.remove(+id);
  }
}
