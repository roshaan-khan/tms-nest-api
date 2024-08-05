import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/schemas/user.schema';
import { UserService } from 'src/modules/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) { }

  private readonly saltRounds = 10;

  async validateUser(phone: string, password: string): Promise<any> {
    const user = await this.usersService.findOne({ phone });
    
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
    const payload = { email: user.email, uid: user._id, phone: user.phone, businessName: user.businessName };
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
}
