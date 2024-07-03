import { IsString, IsEmail, IsNotEmpty, isNotEmpty } from "class-validator";

export class MailDto{
    @IsEmail()
    to: string;

    @IsString()
    @IsNotEmpty()
    subject: string

    @IsString()
    @IsNotEmpty()
    name: string
}