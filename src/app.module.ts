import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeOrmConfig from './config/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User} from './entity/User.entity';
import { AuthModule } from './modules/auth/auth.module';
import { Reservation } from './entity/Reservation.entity';
import { ReservationModule } from './modules/reservation/reservartion.module';
import { UserModule } from './modules/user/user.module';
import { RoomsModule } from './modules/room/rooms.module';
import { ImageModule } from './modules/images/image.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Reservation]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    JwtModule.register({
      global: true,
      signOptions: {
        expiresIn: '1h',
      },
      secret: process.env.JWT_SECRET,
    }),
    AuthModule,UserModule,
    AuthModule,
    ReservationModule,
    RoomsModule,
    ImageModule
  ],
  providers: [],
})
export class AppModule {}
