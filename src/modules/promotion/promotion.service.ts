import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Promotion } from 'src/entity/Promotion.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PromotionService {
  constructor(
    @InjectRepository(Promotion)
    private promotionRepository: Repository<Promotion>,
  ) {}

  async generateUniqueCode(length = 15, tryLimit = 10) {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    let unique = false;
    let tries = 0;

    while (!unique && tries < tryLimit) {
      result = '';
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength),
        );
      }
      unique = await this.isCodeUnique(result);
      tries++;
    }

    return unique ? result : null;
  }

  async isCodeUnique(codeCreated) {
    let isUnique = false;
    const codes = await this.promotionRepository.find();
    if (codes.length === 0) return true;
    codes.forEach((code) => {
      isUnique = code.code === codeCreated ? false : true;
    });
    return isUnique;
  }

  async createNewPromotion(percentage, available_uses = 5, description?) {
    const code = await this.generateUniqueCode();
    const newPromotion: Partial<Promotion> = {
      code: code,
      description: description ? description : '',
      percentage: percentage,
      available_uses: available_uses,
      state: 'AVAILABLE',
    };

    return await this.promotionRepository.save(newPromotion);
  }

  async getAllAvailableCodes() {
    return await this.promotionRepository.find({
      where: { state: 'AVAILABLE' },
    });
  }

  async getByCode(codePromotion) {
    const code = await this.promotionRepository.findOne({
      where: { code: codePromotion },
    });
    if (!code) throw new NotFoundException('Codigo de descuento no encontrado');
    if (code.state !== 'AVAILABLE' || code.available_uses <= 0)
      throw new BadRequestException('Este codigo ya no esta disponible');

    return code;
  }

  async useCode(codePromotion, price) {
    try {
      const code = await this.getByCode(codePromotion);
      const percentage = code.percentage * 0.01;
      const discountedPrice = price - price * percentage;

      await this.promotionRepository.update(code, {
        available_uses: code.available_uses - 1,
        state: code.available_uses - 1 === 0 ? 'DISABLE' : 'AVAILABLE',
      });
      return discountedPrice;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.response.message, error.status);
    }
  }
}
