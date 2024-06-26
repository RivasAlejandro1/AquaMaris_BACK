import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { MembershipStatus } from 'src/enum/MembershipStatus.enum';
import { Roles } from 'src/enum/Role.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @Length(1, 100)
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword: string;

  @IsNotEmpty()
  @IsEnum(Roles)
  role: Roles;

  @IsNumberString()
  @Length(1, 15)
  phone: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  address: string;

  @IsString()
  @IsOptional()
  user_photo: string;

  @IsNotEmpty()
  @IsEnum(MembershipStatus)
  membership_status: MembershipStatus;
}
