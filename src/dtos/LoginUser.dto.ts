import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  /**
   * Email del usuario que se va a loguear
   * @example aquamarishotelz@gmail.com
   */
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * Estatus que se le va a aplicar al comentario [APPROVED, DENIED, IN_REVISION]
   * @example password1!
   */
  @IsString()
  @IsNotEmpty()
  password: string;
}
