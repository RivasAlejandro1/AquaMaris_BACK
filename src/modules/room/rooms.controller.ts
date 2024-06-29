import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Image } from '../../entity/Image.entity';
import { filtersInterceptor } from '../../interceptors/filtersInterceptor.interceptor';
import { filterResponseInterceptor } from '../../interceptors/filtersResponseInterceptor';

@Controller('rooms')
@UseInterceptors(filterResponseInterceptor)
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
  async createRoom(@Body() infoRoom: any) {
    return await this.roomsService.createRoom(infoRoom);
  }
  @Get('filter')
  @UseInterceptors(filtersInterceptor)
  filterRooms(@Query() query) {
    return this.roomsService.filterRoom(query);
  }
  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.roomsService.getById(id);
  }

  @Get()
  async roomsSeeder(success: boolean) {
    return await this.roomsService.roomSeeder();
  }
}
