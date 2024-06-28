import { Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ImagesService } from './images.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class ImagesController {
  constructor(private readonly imagesServices: ImagesService) {}

  async imagesSeeder(success: boolean) {
    return await this.imagesServices.imagesSeeder();
  }

  
  @Get()
  async getAllImages() {
    return await this.imagesServices.getAllImages();
  }

  @Post(':id')
  @UseInterceptors(FileInterceptor('file'))
  async UploudImage(
    @Param() id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.imagesServices.UploudImage(file, id);
  }
}
