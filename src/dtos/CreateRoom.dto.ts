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
