import { IsNotEmpty, IsNumber, IsString, IsUUID, Max, Min } from "class-validator";

export class CommentDto {
    /**
    * ID del usuario que esta realizando la reserva.
    */
    @IsUUID()
    @IsNotEmpty()
    userId: string

      /**
  * ID de la habitacion a la que se esta realizando la reserva
  */
    @IsUUID()
    @IsNotEmpty()
    roomId: string

    /**
   * Comentario del usuario sobre la habitación.
   * @example "La habitación estaba muy limpia y cómoda."
   */
    @IsNotEmpty()
    @IsString()
    comment: string

    /**
  * Calificación del usuario para la habitación.
  * @example 5
  */
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(5)
    rating: number
}