import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from 'src/entity/Image.entity';
import { Repository } from 'typeorm';
import * as images from '../../utils/images.data.json';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image) private imagesRepository: Repository<Image>,
  ) {}

  async imagesSeeder() {
    try {
      for (const image of images) {
        const existingImg = await this.imagesRepository
          .createQueryBuilder('images')
          .where('images.url =:url', { url: image.url })
          .getOne();

        const newImages = this.imagesRepository.create({
          url: image.url,
          date: image.date,
        });

        await this.imagesRepository.save(newImages);
      }
      return true;
    } catch (err) {
      console.log('Error seeding images data from images.data.json', err);
      throw new Error('Error seeding images from images.data.json');
    }
  }
}
