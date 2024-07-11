import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class PromotionDto {
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(100)
  percentage: number;

  @IsNumber()
  @Min(1)
  available_uses: number;
}
