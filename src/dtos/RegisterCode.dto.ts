import { IsEmail, IsNotEmpty, IsNumber } from "class-validator";

export class RegisterUserDto{
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsNumber()
    @IsNotEmpty()
    code: number
}