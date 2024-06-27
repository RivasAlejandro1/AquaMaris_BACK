import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dtos/CreateUser.dto';
import { User } from 'src/entity/User.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async signUp(createUserData: CreateUserDto) {
    /* const { email, password } = createUserData;

    if (createUserData.password !== createUserData.confirmPassword) {
      throw new BadRequestException('Passwords does not match');
    }

    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      throw new BadRequestException('User Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.userRepository.save({
      ...createUserData,
      password: hashedPassword,
    });
    const {
      confirmPassword: confirmP,
      password: pass,
      ...userWithoutPassword
    } = newUser;

    return userWithoutPassword; */
  }
}
