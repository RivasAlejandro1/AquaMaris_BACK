import { MailService } from './../mail/mail.service';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
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
import { Role } from '../../enum/Role.enum';
import { MailDto } from 'src/dtos/Mail.dto';
import { MailType } from '../../enum/MailType.dto';
import { UserIsLockedException } from '../../exceptions/UserIsLocked.exception';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

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
      role: Role.USER,
      phone: createUserData.phone,
      country: createUserData.country,
      user_photo: createUserData.user_photo,
      membership_status: MembershipStatus.DISABLED
    });
    const {
      confirmPassword: confirmP,
      password: pass,
      ...userWithoutPassword
    } = createUserData;

    const mailData: MailDto = {
      to: email,
      subject: "Bienvenido a AquaMaris Hotel's",
      name: createUserData.name,
      type: MailType.REGISTER,
      email: email,
    };

    try {
      await this.mailService.sendMail(mailData);
    } catch (err) {
      console.error('Error sending welcome email ', err);
      throw new InternalServerErrorException('Error sending welcome email');
    }

    return userWithoutPassword;
  }

  async login(loginUserData: LoginUserDto) {
    const { email, password } = loginUserData;

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('Email or password is invalid');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(isPasswordValid);

    if (!isPasswordValid)
      throw new BadRequestException('El correo o la contraseña son invalidas');

    if (user.is_locked) throw new UserIsLockedException();
    if (user.status === false) {
      console.log('User account is not active')
      throw new ForbiddenException('La cuenta del usuario no ha sido activada. Revise su correo');
    }

    const userPayload = {
      sub: user.id,
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const token = this.jwtService.sign(userPayload);

    const { password: _, ...userData } = user;

    return { message: 'User Logged succesfully', token, userData };
  }

  async auth0login(userData: any) {
    const payload = {
      sub: userData.id,
      id: userData.id,
      email: userData.email,
      name: userData.name,
    };

    return {
      access_token: this.jwtService.sign(payload),
      userData,
    };
  }
}
