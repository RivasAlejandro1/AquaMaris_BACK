import { Injectable } from '@nestjs/common';
import { ImageRepository } from './image.repository';

@Injectable()
export class ImageService {
  constructor(private readonly imageRepository: ImageRepository) {}

  async UploudImage(file,room_id){
      return await this.imageRepository.UploudImage(file,room_id)
  }

  async getAllImages(){
      return await this.imageRepository.getAllImages()
  }
}


