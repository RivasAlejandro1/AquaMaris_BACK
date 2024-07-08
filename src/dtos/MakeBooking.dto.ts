import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Validate,
  ValidateNested,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { compareAsc, compareDesc, formatDistance, formatDistanceStrict } from 'date-fns';
import { Companion } from 'src/entity/Companion.entity';

export class CompanionDto {
  @IsString()
  name: string;

  @IsInt()
  @IsNotEmpty()
  identityCard: number;
}
@ValidatorConstraint()
export class beforeThatEnd implements ValidatorConstraintInterface{
  validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
    

    const response = compareAsc((validationArguments.object as MakeBookingDto).check_out_date,value);
    return response == 1;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
      const out = (validationArguments.object as MakeBookingDto).check_out_date
      const IN = (validationArguments.object as MakeBookingDto).check_in_date
      return `Date check_out_date: ${out} must be after that check_in_date: ${IN}`

  }
}

@ValidatorConstraint()
export class afterForOneDay implements ValidatorConstraintInterface{
  validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
    
    const check_in_date = (validationArguments.object as MakeBookingDto).check_in_date
    const diference = formatDistanceStrict( check_in_date ,value, {unit: "day"});
    const cantity = diference.split("d")[0];

    return Number(cantity) >= 1;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
      const out = (validationArguments.object as MakeBookingDto).check_out_date
      const IN = (validationArguments.object as MakeBookingDto).check_in_date
      return `Date check_out_date: ${out} must be after min 1 day that check_in_date: ${IN}`

  }
}

@ValidatorConstraint()
export class minToday implements ValidatorConstraintInterface{
  validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
    
    const currentUTC = new Date();

    const offset = -5; 

    const currentDateTimeInBogota = new Date(currentUTC.getTime() + offset * 60 * 60 * 1000);
    const formattedDateTime = currentDateTimeInBogota.toISOString().split("T")[0].split("-").map( e => Number(e));
    const dateNowBogota = new Date(formattedDateTime[0], formattedDateTime[1]-1, formattedDateTime[2])
    
    const diference = Number(compareDesc( dateNowBogota,value));
    
  
    console.log("diference:",diference)
    console.log("value:",value)
    console.log("today:", dateNowBogota)

    return (diference == 0 || diference == 1) 
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
      return `check_in_date can´t be in the past`
  }
}


export class MakeBookingDto {
    @IsDate()
    @Validate(beforeThatEnd)
    @Validate(minToday)
    @IsNotEmpty()
    check_in_date: Date;
    
    @IsDate()
    @Validate(afterForOneDay)
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
