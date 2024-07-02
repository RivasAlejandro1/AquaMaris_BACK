import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from '../../entity/Image.entity';
// import { CloudinaryConfig } from 'src/config/cloudinary';
// import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Room } from 'src/entity/Room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Image, Room])],
  controllers: [ImagesController],
  providers: [ImagesService,
    // CloudinaryConfig, CloudinaryService
  ],
})
export class ImagesModule { }
