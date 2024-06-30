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
  price: number;

  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(RoomStates)
  state: string;


  @IsNumber()
  @IsInt()
  @IsPositive()
  roomNumber: number;
  
  @IsUUID()
  @IsOptional()
  hotel: string;
  
  @IsArray()
  @IsEnum(Services, { each: true })
  services: Services[];
  
    
  @IsArray()
  @IsUrl({}, {each: true})
  images: string[];
  
 /*  @IsArray()
  booking: Booking; */
 
}
