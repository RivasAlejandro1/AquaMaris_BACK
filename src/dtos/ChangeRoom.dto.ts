import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsPositive,
  IsDecimal,
  IsUUID,
  IsArray,
  IsInt,
  IsUrl,
  IsEnum,
  Validate,
  ValidationArguments,
  IsOptional,
  ValidatorConstraintInterface,
  ValidatorConstraint,
} from 'class-validator';
import { RoomStates } from 'src/enum/RoomStates.enum';
import { TypesRooms } from 'src/enum/RoomTypes.enum';
import { Services } from 'src/enum/Services.enum';

@ValidatorConstraint({name: "TwoDecimals", async: false})
export class TwoDecimals implements ValidatorConstraintInterface {
  validate(value: any, validationArguments?: ValidationArguments): boolean | Promise<boolean> {
    const regex = /^\d+(\.\d{0,2})?$/
    return regex.test(value.toString())
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `Price must have between cero and two decimals `
  }
}

export class ChangeRoomDto {

  @IsOptional()
  @IsEnum(TypesRooms)
  @IsNotEmpty()
  type: TypesRooms;

  
  @IsOptional()
  @IsNumber()
  @Validate(TwoDecimals)
  @IsNotEmpty()
  price: number;

  
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string;


  @IsOptional()
  @IsNumber()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  roomNumber: number;
  
  @IsOptional()
  @IsUUID()
  hotel: string;
  
  @IsOptional()
  @IsArray()
  @IsEnum(Services, { each: true })
  services: Services[];
  
    
  @IsOptional()
  @IsArray()
  @IsUrl({}, {each: true})
  images: string[];
  
 /*  @IsArray()
  booking: Booking; */
 
}
