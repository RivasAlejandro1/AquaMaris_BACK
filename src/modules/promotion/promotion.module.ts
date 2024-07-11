import { Module } from '@nestjs/common';
import { PromotionController } from './promotion.controller';
import { PromotionService } from './promotion.service';
import { Promotion } from 'src/entity/Promotion.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Promotion])],
  controllers: [PromotionController],
  providers: [PromotionService],
})
export class PromotionModule {}
