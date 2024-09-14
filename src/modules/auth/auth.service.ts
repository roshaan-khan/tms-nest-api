import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/schemas/user.schema';
import { UserService } from 'src/modules/user/user.service';
import * as bcrypt from 'bcrypt';
import { IPayload } from 'src/types/common.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) { }

  private readonly saltRounds = 10;

  async validateUser(emailOrPhone: string, password: string): Promise<any> {
    let user = null;

    if (this.isEmail(emailOrPhone)) {
      user = await this.usersService.findOne({ email: emailOrPhone });
    } else {
      user = await this.usersService.findOne({ phone: emailOrPhone });
    }

    if (!user) {
      return null;
    }

    const isMatch = await this.comparePassword(password, user.password);

    if (isMatch) {
      return user;
    }

    const { password: pass, ...result } = user;
    return result;
  }

  async login(user: User) {
    const payload: IPayload = { email: user.email, uid: user._id, phone: user.phone, name: user.name };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async register(user: User) {
    user.password = await this.hashPassword(user.password);
    return await this.usersService.create(user);
  }

  private isEmail(emailOrPhone: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailOrPhone);
  }
}
