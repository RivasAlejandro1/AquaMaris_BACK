import { Controller } from '@nestjs/common';
import { ImagesService } from './images.service';

@Controller()
export class ImagesController {
  constructor(private readonly imagesServices: ImagesService) {}

  async imagesSeeder(success: boolean) {
    return await this.imagesServices.imagesSeeder();
  }
}
