import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Companion } from 'src/entity/Companion.entity';

export class CompanionDto {
  @IsString()
  name: string;

  @IsInt()
  @IsNotEmpty()
  identityCard: number;
}

export class MakeBookingDto {
    @IsDate()
    @IsNotEmpty()
    check_in_date: Date;
    
    @IsDate()
    @IsNotEmpty()
    check_out_date: Date;

    @IsUUID()
    @IsNotEmpty()
    userId: string;

    @IsUUID()
    @IsNotEmpty()
    roomId: string;
     
    @IsOptional()
    @IsArray()
    @ValidateNested()
    @Type(() => CompanionDto)
    companions: CompanionDto[]
}
