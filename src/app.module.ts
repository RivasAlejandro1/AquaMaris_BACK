import { ImagesController } from './modules/images/images.controller';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeOrmConfig from './config/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from './entity/User.entity';
import { AuthModule } from './modules/auth/auth.module';
import { BookingModule } from './modules/booking/booking.module';
import { HotelModule } from './modules/hotel/hotel.module';
import { ImagesModule } from './modules/images/images.module';
import { RoomsModule } from './modules/room/rooms.module';
import { ServiceModule } from './modules/service/service.module';
import { UserModule } from './modules/user/user.module';
import { HotelController } from './modules/hotel/hotel.controller';
import { RoomsController } from './modules/room/rooms.controller';
import { ServiceController } from './modules/service/service.controller';
import { UserController } from './modules/user/user.controller';
import { BookingController } from './modules/booking/booking.controller';
import { Booking } from './entity/Booking.entity';
import { Hotel } from './entity/Hotel.entity';
import { Room } from './entity/Room.entity';
import { Service } from './entity/Service.entity';
import { Image } from './entity/Image.entity';
import { HotelService } from './modules/hotel/hotel.service';
import { ServiceService } from './modules/service/service.service';
import { RoomsService } from './modules/room/rooms.service';
import { ImagesService } from './modules/images/images.service';
import { UsersService } from './modules/user/user.service';
import { BookingService } from './modules/booking/booking.service';
import { RoomsRepository } from './modules/room/rooms.repository';
// import { CloudinaryService } from './modules/cloudinary/cloudinary.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([User, Booking, Hotel, Image, Room, Service]),
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
    AuthModule,
    BookingModule,
    HotelModule,
    ImagesModule,
    RoomsModule,
    ServiceModule,
    UserModule,
  ],
  providers: [
    HotelController,
    ServiceController,
    RoomsController,
    ImagesController,
    UserController,
    BookingController,
    HotelService,
    ServiceService,
    // CloudinaryService,
    RoomsService,
    ImagesService,
    UsersService,
    BookingService,
    RoomsRepository,
    UserModule,
    RoomsModule,
  ],
})
export class AppModule {
  constructor(
    private readonly hotelController: HotelController,
    private readonly serviceController: ServiceController,
    private readonly roomsController: RoomsController,
    private readonly ImagesController: ImagesController,
    private readonly userController: UserController,
    private readonly bookingController: BookingController,
  ) {}

  async onApplicationBootstrap() {
    console.log('RUN HOTEL SEEDER');
    const successHotel = await this.hotelController.hotelSeeder(true);
    console.log('RUN SERVICE SEEDER');
    const successService =
      await this.serviceController.serviceSeeder(successHotel);
    console.log('RUN USERS SEEDER');
    const successUser = await this.userController.seeder(successService);
    console.log('RUN IMAGES SEEDER');
    const successImages = await this.ImagesController.imagesSeeder(successUser);
    console.log('RUN ROOMS SEEDER');
    const successRooms = await this.roomsController.roomsSeeder(successImages);
    console.log('RUN BOOKING SEEDER');
    await this.bookingController.bookingSeeder(successService);
  }
}
