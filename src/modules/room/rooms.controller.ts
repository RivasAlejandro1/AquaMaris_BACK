import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { filtersInterceptor } from '../../interceptors/filtersInterceptor.interceptor';
import { filterResponseInterceptor } from '../../interceptors/filtersResponseInterceptor';
import { CreateRoomDto } from 'src/dtos/CreateRoom.dto';

@Controller('rooms')
@UseInterceptors(filterResponseInterceptor)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  getAllRoms(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 3,
  ) {
    return this.roomsService.getAllRooms(page, limit);
  }

  @Post()
  async createRoom(@Body() infoRoom: CreateRoomDto) {
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

  @Get('roomByNum/:num')
  async getByNum(@Param('num') num) {
    return await this.roomsService.getByNum(Number(num));
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.roomsService.getById(id);
  }
}
