import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from 'src/entity/Image.entity';
import { Repository } from 'typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { RoomsRepository } from '../room/rooms.repository';
import { Room } from 'src/entity/Room.entity';

@Injectable()
export class ImageRepository {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    private readonly cloudinaryService: CloudinaryService,
    @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
  ) {}

    async getAllImages(){
        return await this.imageRepository.find({relations: {room: true}})
    }

    async UploudImage(file, room_id) {
      const uploadImage = await this.cloudinaryService.uploudImage(file);
      const newImage = this.imageRepository.create();
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
        const imageRegister = await this.imageRepository.findOne({ where:{ id: idImage.id}, relations: { room: true}})  */
    return { url: newImage.url }; //, idImage} //, imageRegister }
  }
}
