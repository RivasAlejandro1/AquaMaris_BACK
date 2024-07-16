import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class RegisterUserDto {
    /**
* Este es el correo que ser comprobara para validar si el usuario tiene validada la cuenta 
* @example aquamarishotelz@gmail.com
*/
    @IsEmail()
    @IsNotEmpty()
    email: string

    /**
* Este es el codigo enviado para validar la cuenta
*/
    @IsString()
    @IsNotEmpty()
    code: string
}