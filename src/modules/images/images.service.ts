import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from '../../entity/Image.entity';
import { Repository } from 'typeorm';
import * as images from '../../utils/images.data.json';
<<<<<<< Updated upstream
import { Room } from 'src/entity/Room.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
=======
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Room } from 'src/entity/Room.entity';
>>>>>>> Stashed changes

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image) private imagesRepository: Repository<Image>,
<<<<<<< Updated upstream
    @InjectRepository(Room) private roomRepository: Repository<Room>
    , private readonly cloudinaryService: CloudinaryService
  ) { }
=======
    private readonly cloudinaryService: CloudinaryService,
    @InjectRepository(Room) private roomRepository: Repository<Room>,
  ) {}
>>>>>>> Stashed changes

  async imagesSeeder() {
    let number = 0
    try {
      for (const image of images) {
<<<<<<< Updated upstream
        console.log(number++)
        const existingImg = await this.imagesRepository
=======
        const existingImage = await this.imagesRepository
>>>>>>> Stashed changes
          .createQueryBuilder('images')
          .where('images.url =:url', { url: image.url })
          .getOne();

<<<<<<< Updated upstream

        if (!existingImg) {
          console.log(number++)
          const newImages = this.imagesRepository.create({
            url: image.url,
            date: image.date,
          });

          console.log(newImages)
=======
        if (!existingImage) {
          const newImages = this.imagesRepository.create({
            url: image.url,
            date: image.date,
          });

>>>>>>> Stashed changes
          await this.imagesRepository.save(newImages);
        }
      }
      return true;
    } catch (err) {
      console.log('Error seeding images data from images.data.json', err);
      throw new Error('Error seeding images from images.data.json');
    }
  }

<<<<<<< Updated upstream
  async getAllImages() {
    return await this.imagesRepository.find({ relations: { room: true } });
  }

  async UploudImage(file, room_id) {
=======
  async UploadImage(file, room_id) {
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
    /* 
=======
    /*
>>>>>>> Stashed changes
        const imageRegister = await this.imageRepository.findOne({ where:{ id: idImage.id}, relations: { room: true}})  */
    return { url: newImage.url }; //, idImage} //, imageRegister }
  }
}
