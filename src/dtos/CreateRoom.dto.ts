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
} from 'class-validator';
import { RoomStates } from 'src/enum/RoomStates.enum';
import { TypesRooms } from 'src/enum/RoomTypes.enum';
import { Services } from 'src/enum/Services.enum';


export class CreateRoomDto {

  @IsEnum(TypesRooms)
  @IsNotEmpty()
  type: TypesRooms;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(RoomStates)
  @IsNotEmpty()
  state: string;


  @IsNumber()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  roomNumber: number;
  
  @IsUUID()
  @IsOptional()
  hotel: string;
  
  @IsArray()
  @IsEnum(Services, { each: true })
  @IsOptional()
  services: Services[];
  
    
  @IsArray()
  @IsUrl({}, {each: true})
  images: string[];
  
 /*  @IsArray()
  booking: Booking; */
 
}
