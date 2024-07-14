import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '../../dtos/CreateUser.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../../dtos/LoginUser.dto';
import { UsersService } from '../user/user.service';
import { ApiTags } from '@nestjs/swagger';
import { Guard_admin } from 'src/guardiane/admin_guard';

@ApiTags('Authorization')
@UseGuards(Guard_admin)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('signup')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserData: LoginUserDto) {
    return this.authService.login(loginUserData);
  }

  // @UseGuards(JwtAuthGuard)
  @Post('auth0login')
  async auth0Login(@Req() req) {
    console.log(req.body);
    const user = await this.userService.findOrCreateUser(req.body);
    return this.authService.auth0login(user);
  }
}
