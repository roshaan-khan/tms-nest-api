import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) { }

  async create(createUserDto: User) { 
    return await this.userModel.create(createUserDto);
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async findOne(filter: FilterQuery<User>): Promise<User> {
    const user = await this.userModel.findOne(filter).exec();
    return user;
  }

  async update(id: string, updateUserDto: any): Promise<User> {
    return await this.userModel.findByIdAndUpdate({ _id: id }, updateUserDto, { new: true }).exec();
  }

  async remove(id: string): Promise<any> {
    return await this.userModel.deleteOne({ _id: id }).exec();
  }
}
