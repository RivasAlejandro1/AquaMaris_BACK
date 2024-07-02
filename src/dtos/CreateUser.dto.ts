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
  @Length(1, 15)
  phone: number;

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
