import { Module } from '@nestjs/common';
import { PromotionController } from './promotion.controller';
import { PromotionService } from './promotion.service';

@Module({
  controllers: [PromotionController],
  providers: [PromotionService],
})
export class PromotionModule {}
