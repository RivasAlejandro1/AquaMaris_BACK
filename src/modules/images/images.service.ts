import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from '../../entity/Image.entity';
import { Repository } from 'typeorm';
import * as images from '../../utils/images.data.json';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Room } from 'src/entity/Room.entity';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image) private imagesRepository: Repository<Image>,
    private readonly cloudinaryService: CloudinaryService,
    @InjectRepository(Room) private roomRepository: Repository<Room>,
  ) {}

  async imagesSeeder() {
    try {
      for (const image of images) {
        const existingImage = await this.imagesRepository
          .createQueryBuilder('images')
          .where('images.url =:url', { url: image.url })
          .getOne();

        if (!existingImage) {
          const newImages = this.imagesRepository.create({
            url: image.url,
            date: image.date,
          });

          await this.imagesRepository.save(newImages);
        }
      }
      return true;
    } catch (err) {
      console.log('Error seeding images data from images.data.json', err);
      throw new Error('Error seeding images from images.data.json');
    }
  }

  async getAllImages() {
    return await this.imagesRepository.find({ relations: { room: true } });
  }

  async UploadImage(file, room_id) {
    const uploadImage = await this.cloudinaryService.uploudImage(file);
    const newImage = this.imagesRepository.create();
    newImage.url = uploadImage.url;
    newImage.date = new Date();

    const roomFinded = await this.roomRepository.findOne({
      where: { id: room_id },
    });
    //newImage.room = roomFinded;

    //roomFinded.images.push(newImage);

    //const idImage = await this.imageRepository.save(newImage)
    //await this.roomRepository.save(roomFinded)

    /*
    /*
        const imageRegister = await this.imageRepository.findOne({ where:{ id: idImage.id}, relations: { room: true}})  */
    return { url: newImage.url }; //, idImage} //, imageRegister }
  }
}
