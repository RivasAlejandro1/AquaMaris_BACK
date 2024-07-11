import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PromotionService } from './promotion.service';

@Controller('promotion')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Post('newPromotionCode')
  async createPromotionCode(@Body() data) {
    const { description, percentage, available_uses } = data;
    return await this.promotionService.createNewPromotion(
      percentage,
      available_uses,
      description,
    );
  }

  @Post('useCode')
  async useCode(@Body() data) {
    const { code, price } = data;
    return await this.promotionService.useCode(code, price);
  }

  @Get()
  async getAllAvailableCodes() {
    return await this.promotionService.getAllAvailableCodes();
  }

  @Get(':code')
  async getByCode(@Param() code) {
    return await this.promotionService.getByCode(code.code);
  }
}
