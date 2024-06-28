import { Controller, Param, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ImageService } from "./image.service";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("images")
export class ImageController{

    constructor( private readonly imageService: ImageService){}

    @Post(":id")
    @UseInterceptors(FileInterceptor("file"))
    async UploudImage(@Param() id: string,  @UploadedFile() file: Express.Multer.File){
        return await this.imageService.UploudImage(file,id)
    }

    @Post("perfil/:id")
    @UseInterceptors(FileInterceptor('file'))
    async imageuser(@Param('id') id:string, @UploadedFile() file:Express.Multer.File){
        return this.imageService.imageuser(id, file)
    }
    
}