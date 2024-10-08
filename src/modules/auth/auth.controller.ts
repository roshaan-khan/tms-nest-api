import { Controller, Post, UsePipes, Body, ConflictException, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/schemas/user.schema';
import { JoiValidationPipe } from 'src/pipe/joi-validation.pipe';
import { CreateUserSchema, loginUserSchema } from 'src/modules/user/user.dto';
import { UserService } from 'src/modules/user/user.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly userService: UserService) { }

    @Post('login')
    @UsePipes(new JoiValidationPipe(loginUserSchema))
    async login(@Body() user: any) {
        const { emailOrPhone, password } = user
        const check = await this.authService.validateUser(emailOrPhone, password);

        if (!check) {
            throw new NotFoundException('User not found');
        }

        return this.authService.login(check);
    }

    @Post('register')
    @UsePipes(new JoiValidationPipe(CreateUserSchema))
    async register(@Body() user: User) {
        const isExists = await this.userService.findOne({ phone: user.phone });

        if (isExists) {
            throw new ConflictException('User already exists');
        }

        const createdUser = this.authService.register(user);

        return { 'msg': 'User created successfully', data: createdUser };
    }
}
