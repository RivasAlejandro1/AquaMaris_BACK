import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesAdmin } from '../../help/roles.decoretion';
import { Guard_admin } from '../../guardiane/admin_guard';
import { Role } from '../../enum/Role.enum';
import { AuthGuard } from 'src/guardiane/auth.guard';

@ApiTags('Promotions')
@Controller('promotion')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @ApiBearerAuth()
  @Post('newPromotionCode')
  @RolesAdmin(Role.ADMIN)
  @UseGuards(AuthGuard, Guard_admin)
  async createPromotionCode(@Body() data) {
    const { description, percentage, available_uses } = data;
    return await this.promotionService.createNewPromotion(
      percentage,
      available_uses,
      description,
    );
  }
  @ApiBearerAuth()
  @Post('useCode')
  @RolesAdmin(Role.USER)
  @UseGuards(AuthGuard, Guard_admin)
  async useCode(@Body() data) {
    const { code, price } = data;
    return await this.promotionService.useCode(code, price);
  }

  //@ApiBearerAuth()
  @Get()
  /* @RolesAdmin(Role.ADMIN)
  @UseGuards(AuthGuard, Guard_admin) */
  async getAllAvailableCodes() {
    return await this.promotionService.getAllAvailableCodes();
  }

  //@ApiBearerAuth()
  @Get(':code')
  /* @RolesAdmin(Role.ADMIN, Role.USER)
  @UseGuards(AuthGuard, Guard_admin) */
  async getByCode(@Param() code) {
    return await this.promotionService.getByCode(code.code);
  }
}
