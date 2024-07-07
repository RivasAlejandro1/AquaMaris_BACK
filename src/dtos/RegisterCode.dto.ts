import { IsNotEmpty, IsNumber, IsUUID } from "class-validator";

export class RegisterUserDto{
    @IsUUID()
    @IsNotEmpty()
    userId: string

    @IsNumber()
    @IsNotEmpty()
    code: number
}