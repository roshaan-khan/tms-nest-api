import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, UsePipes, ConflictException, Req, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
  constructor(private readonly employeeService: EmployeeService) { }
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
    const offset = Number(req.query.offSet) || 10;
    const page = Number(req.query.page) || 1;
    const skip = offset * page - offset;
    const { employees, total } = await this.employeeService.findAll({ employeeOf: new Types.ObjectId(req.user.uid) }, offset, skip);
    return { msg: '', data: employees, total }
  }

  @Get(':id')
  async findOne(@Param('id') id: Types.ObjectId) {
    const employee = await this.employeeService.findOne(id);

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return { msg: '', data: employee }
  }
  
  @Put(':id')
  @UsePipes(new JoiValidationPipe(employeeSchema))
  async update(@Param('id') id: string, @Body() updateEmployeeDto: Employee, @Req() req: Request) {
    const updatedEmployee = await this.employeeService.update(id, updateEmployeeDto, req.user.uid);
    return { msg: `${this.ModuleName} updated Successfully`, data: updatedEmployee }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.employeeService.remove(id);
    return { msg: `${this.ModuleName} deleted Successfully` }
  }
}
