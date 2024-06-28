import { Injectable, NotFoundException } from "@nestjs/common";
import { ImageRepository } from "./image.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entity/User.entity";
import { Repository } from "typeorm";



@Injectable()
export class ImageService {
    constructor( private readonly imageRepository: ImageRepository,
     @InjectRepository(User) private readonly userDBrepository: Repository<User> ){
    }


    async UploudImage(file,room_id){
        return await this.imageRepository.UploudImage(file,room_id)
    }

    async imageuser(id:string, file:Express.Multer.File){
        const user_id = await this.userDBrepository.findOneBy({id:id})
       if(!user_id) throw new NotFoundException('user not found')
       const uploadedperfil = await this.imageRepository.imageuser(file);
    console.log(uploadedperfil)
       const update = await this.userDBrepository.update(user_id,{user_photo:uploadedperfil.secure_url})
       console.log(update)
       return update
    }

}