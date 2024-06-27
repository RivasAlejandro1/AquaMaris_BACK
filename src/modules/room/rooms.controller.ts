import { Controller, Get, Query } from '@nestjs/common';
import { RoomsService } from './rooms.service';

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

  @Get()
  roomsSeeder() {
    return this.roomsService.roomSeeder();
  }
}
