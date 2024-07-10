import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class RegisterUserDto{
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    code: string
}