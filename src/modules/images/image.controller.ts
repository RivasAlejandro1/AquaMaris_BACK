import {
  Controller,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}
  
  @Get()
  async getAllImages(){
      return await this.imageService.getAllImages()
  }

  @Post(':id')
  @UseInterceptors(FileInterceptor('file'))
  async UploudImage(
    @Param() id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.imageService.UploudImage(file, id);
  }
}