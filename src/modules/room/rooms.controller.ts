import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { filtersInterceptor } from '../../interceptors/filtersInterceptor.interceptor';
import { CreateRoomDto } from 'src/dtos/CreateRoom.dto';
import { ChangeRoomDto } from 'src/dtos/changeRoom.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Rooms')
@Controller('rooms')
//@UseInterceptors(filterResponseInterceptor)
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
  
  @Put('suspend/:id')
  async changeStateRoom( 
    @Param('id', ParseUUIDPipe) id, 
    @Query("state") state:string = "inmaintenance", 
    @Query("youAreShore") youAreShore:boolean = false
  ) {
    return await this.roomsService.changeStateRoom(id, state, youAreShore);
  }
  @Put(':id')
  async changeRoom( @Param('id', ParseUUIDPipe) id, @Body() infoRoom: ChangeRoomDto) {
    console.log("hola")
    return await this.roomsService.changeRoom(id,infoRoom);
  }
  @Get(':id')
  async getById(@Param('id') id) {
    return await this.roomsService.getById(id);
  }
}
