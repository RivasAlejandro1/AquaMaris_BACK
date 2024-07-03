import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { MembershipStatus } from '../enum/MembershipStatus.enum';
import { Role } from '../enum/Role.enum';

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
  @IsEnum(Role)
  role: Role;

  @IsNumberString()
  @IsOptional()
  @Length(1, 15)
  phone: number;

  @IsString()
  @IsOptional()
  @Length(1, 255)
  country: string;

  @IsString()
  @IsOptional()
  user_photo: string;

  @IsOptional()
  @IsEnum(MembershipStatus)
  membership_status: MembershipStatus;
}
