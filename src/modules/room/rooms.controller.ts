import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Image } from 'src/entity/Image.entity';
import { filtersInterceptor } from 'src/interceptors/filtersInterceptor.interceptor';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  getAllRoms(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 6,
  ) {
    return this.roomsService.getAllRooms(page, limit);
  }

    @Post()
    async createRoom(@Body() infoRoom:any){
      return await this.roomsService.createRoom(infoRoom);
    }

    
    @Get()
    async roomsSeeder(success: boolean) {
      return await this.roomsService.roomSeeder();
    }
    
    @Get('filter')
    @UseInterceptors(filtersInterceptor)
    filterRooms(@Query() query) {
      return this.roomsService.filterRoom(query);
    }

}
