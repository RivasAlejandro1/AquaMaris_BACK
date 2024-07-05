import { IsString, IsEmail, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { MailType } from 'src/enum/MailType.dto';

export class MailDto {
  @IsEmail()
  to: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(MailType)
  @IsNotEmpty()
  type: MailType;

  @IsString()
  @IsOptional()
  message?: string;

  @IsString()
  @IsOptional()
  reservationDate?: string;

  @IsString()
  @IsOptional()
  roomNumber?: string;
}