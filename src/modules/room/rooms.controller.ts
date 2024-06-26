import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { filtersInterceptor } from 'src/interceptors/filtersInterceptor.interceptor';
//import { ServicesRoomFilterDto } from 'src/dtos/servicesRoomFilter.dto';

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

  @Get('filter')
  @UseInterceptors(filtersInterceptor)
  filterRooms(@Query() query) {
    return this.roomsService.filterRoom(query);
  }
}
