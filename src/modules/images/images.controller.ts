<<<<<<< Updated upstream
import { Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
=======
import {
  Controller,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
>>>>>>> Stashed changes
import { ImagesService } from './images.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class ImagesController {
  constructor(private readonly imagesServices: ImagesService) {}

  async imagesSeeder(success: boolean) {
    return await this.imagesServices.imagesSeeder();
  }

<<<<<<< Updated upstream
  
  @Get()
  async getAllImages() {
    return await this.imagesServices.getAllImages();
  }

=======
>>>>>>> Stashed changes
  @Post(':id')
  @UseInterceptors(FileInterceptor('file'))
  async UploudImage(
    @Param() id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
<<<<<<< Updated upstream
    return await this.imagesServices.UploudImage(file, id);
=======
    return await this.imagesServices.UploadImage(file, id);
>>>>>>> Stashed changes
  }
}
