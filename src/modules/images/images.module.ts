import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
<<<<<<< Updated upstream
import { Image } from '../../entity/Image.entity';
import { CloudinaryConfig } from 'src/config/cloudinary';
=======
import { Image } from 'src/entity/Image.entity';
>>>>>>> Stashed changes
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Room } from 'src/entity/Room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Image, Room])],
<<<<<<< Updated upstream
  controllers: [ImagesController],
  providers: [
    ImagesService,
    CloudinaryConfig,
    CloudinaryService,
  ],
=======
  providers: [ImagesService, CloudinaryService],
  controllers: [ImagesController],
>>>>>>> Stashed changes
})
export class ImagesModule {}
