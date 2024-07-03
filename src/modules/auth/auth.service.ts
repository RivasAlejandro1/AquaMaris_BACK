import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../../dtos/CreateUser.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from '../../dtos/LoginUser.dto';
import { JwtService } from '@nestjs/jwt';
import { MembershipStatus } from '../../enum/MembershipStatus.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entity/User.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }

  async signUp(createUserData: CreateUserDto) {
    const { email, password } = createUserData;

    if (createUserData.password !== createUserData.confirmPassword) {
      throw new BadRequestException('Passwords does not match');
    }

    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      throw new BadRequestException('User Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.userRepository.save({
      name: createUserData.name,
      email: createUserData.email,
      password: hashedPassword,
      role: createUserData.role,
      phone: createUserData.phone,
      address: createUserData.address,
      user_photo: createUserData.user_photo,
      membership_status: MembershipStatus.DISABLED,
    });
    const {
      confirmPassword: confirmP,
      password: pass,
      ...userWithoutPassword
    } = createUserData;

    return createUserData;
  }

  async login(loginUserData: LoginUserDto) {
    const { email, password } = loginUserData;

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      throw new BadRequestException('Email or password is invalid');

    const userPayload = {
      sub: user.id,
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const token = this.jwtService.sign(userPayload);

    return { message: 'User Logged succesfully', token };
  }

  async auth0login(user: any) {
    const payload = { 
      sub: user.id, 
      id: user.id,
      email: user.email, 
      name: user.name 
    }
    return {
      access_token: this.jwtService.sign(payload)
    }
  }
}
