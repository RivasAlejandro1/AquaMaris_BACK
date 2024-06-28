import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Image } from "src/entity/Image.entity";
import { Repository } from "typeorm";
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { RoomsRepository } from "../room/rooms.repository";
import { Room } from "src/entity/Room.entity";
import { UploadApiResponse, v2 } from "cloudinary";
const ToStream = require('buffer-to-stream');



@Injectable()
export class ImageRepository {
    constructor(
        @InjectRepository(Image) private readonly imageRepository: Repository<Image>,
        private readonly cloudinaryService: CloudinaryService,
        @InjectRepository(Room) private readonly roomRepository: Repository<Room>
        
    ){}

    async UploudImage(file , room_id){
        const uploadImage = await this.cloudinaryService.uploudImage(file);
        const newImage = this.imageRepository.create()
        newImage.url = uploadImage.url;
        newImage.date = new Date();

        const roomFinded = await this.roomRepository.findOne({where:{id: room_id}});
        //newImage.room = roomFinded;

        //roomFinded.images.push(newImage);

        //const idImage = await this.imageRepository.save(newImage)
        //await this.roomRepository.save(roomFinded)

/* 
        const imageRegister = await this.imageRepository.findOne({ where:{ id: idImage.id}, relations: { room: true}})  */
        return {url: newImage.url}//, idImage} //, imageRegister }
    }

    async imageuser( file:Express.Multer.File):Promise<UploadApiResponse>{
        return  new Promise((resolve, reject)=>{
            const upload = v2.uploader.upload_stream(
             {resource_type:'auto'},
             (error,result)=>{
              (error)?reject(error):resolve(result)
             }
          )
        ToStream(file.buffer).pipe(upload)
      })
    
      }
}