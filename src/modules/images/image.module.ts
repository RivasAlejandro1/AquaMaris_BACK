import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageRepository } from './image.repository';
import { ImageController } from './image.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from 'src/entity/Image.entity';
import { CloudinaryConfig } from 'src/config/cloudinary';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Room } from 'src/entity/Room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Image, Room])],
  controllers: [ImageController],
  providers: [
    ImageService,
    ImageRepository,
    CloudinaryConfig,
    CloudinaryService,
  ],
})
export class ImageModule {}
