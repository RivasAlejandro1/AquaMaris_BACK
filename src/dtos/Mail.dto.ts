import { IsString, IsEmail, IsNotEmpty, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { MailType } from 'src/enum/MailType.dto';

export class MailDto {
       /**
   * Email al que se va a enviar el correo
   * @example APPROVED
   */
  @IsEmail()
  to: string;

   /**
   * Asunto que se mostrara en la peticion 
   * @example Este es un correo de prueba
   */
  @IsString()
  @IsNotEmpty()
  subject: string;

  /**
   * Nombre de la persona a la que le va a llegar el correo
   * @example AquaMaris
   */
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * Tipo de correo que se esta enviando ['reservation', 'cancellation', 'membership_subscription', 'membership_cancellation', 'register']
   * @example  register
   */
  @IsEnum(MailType)
  @IsNotEmpty()
  type: MailType;

   /**
   * Este es un mensaje personalizado en caso que se quiera mandar algo en especifico
   * @example  este es un mensaje de prueba
   */
  @IsString()
  @IsOptional()
  message?: string;

   /**
   * Este mensaje va en caso de que el tipo de mensaje sea de reservacion deberia ir la fecha de la reservacion
   */
  @IsString()
  @IsOptional()
  reservationDate?: string;

   /**
   * En este ira el numero de la habitacion en caso de una cancelacion o de una reservacion
   */
  @IsString()
  @IsOptional()
  roomNumber?: string;

  /**
   * Este mensaje es para comprobar que se esta mandado el correo para la validacion de cuenta
   */
  @IsEmail()
  @IsOptional()
  email: string  
}