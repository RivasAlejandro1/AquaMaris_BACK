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
} from 'class-validator';
import { RoomStates } from 'src/enum/RoomStates.enum';
import { TypesRooms } from 'src/enum/RoomTypes.enum';


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
  @IsNotEmpty()
  hotel: string;
  
  @IsArray()
  @IsUUID("all", { each: true })
  services: string[];
  
    
  @IsArray()
  @IsUrl({}, {each: true})
  images: string[];
  
 /*  @IsArray()
  booking: Booking; */
 
}
