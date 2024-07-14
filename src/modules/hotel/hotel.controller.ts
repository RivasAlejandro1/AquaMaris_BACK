import { Controller, Get } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('Hotel')
@Controller('hotel')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Get()
  async hotelSeeder(success: boolean) {
    return await this.hotelService.hotelSeeder();
  }
}
