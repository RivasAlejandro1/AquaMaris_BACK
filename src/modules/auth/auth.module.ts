import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entity/User.entity';
import { UsersService } from '../user/user.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { JwtAuthGuard } from 'src/guardiane/jwt-auth.guard';
import { MailService } from '../mail/mail.service';
import { RegisterCode } from 'src/entity/RegisterCodes';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RegisterCode]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1hr' },
    }),
  ],
  providers: [AuthService, UsersService, JwtStrategy, JwtAuthGuard, MailService],
  controllers: [AuthController],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
