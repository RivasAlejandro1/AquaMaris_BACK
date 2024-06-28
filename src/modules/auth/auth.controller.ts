import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../../dtos/CreateUser.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../../dtos/LoginUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserData: LoginUserDto) {
    return this.authService.login(loginUserData);
  }
}
