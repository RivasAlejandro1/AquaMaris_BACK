import { Body, Controller, Get, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  getAllRoms(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
  ) {
    return this.roomsService.getAllRooms(page, limit);
  }

  @Post()
   async createRoom(@Body() infoRoom:any){
    
   return await this.roomsService.createRoom(infoRoom);
  }

  @Post("seeder")
  async seederAllAboutRoom(){
   return  await this.roomsService.seederAllAboutRoom();
 }
}
