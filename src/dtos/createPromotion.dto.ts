import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class PromotionDto {
  /**
   * Descripcion para el codigo de promocion (opcional)
   * @example codigo con descuento del 15%
   */
  @IsString()
  description: string;
  /**
   * Porcentaje de descuento que tendra el codigo
   * @example 20
   */
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(100)
  percentage: number;
  /**
   * Cantidad de usos disponibles para el codgo (5 por defecto)
   * @example 2
   */
  @IsNumber()
  @Min(1)
  available_uses: number;
}
