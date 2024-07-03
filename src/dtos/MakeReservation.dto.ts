import { Type } from "class-transformer";
import { IsArray, IsDate, IsInt, IsNotEmpty, IsString, IsUUID, ValidateNested } from "class-validator";
import { Companion } from "src/entity/Companion.entity";

export class CompanionDto{
    @IsString()
    name: string;

    @IsInt()
    @IsNotEmpty()
    identityCard: number;
}


export class MakeBookingDto {

    @IsNotEmpty()
    check_in_date: Date;
    
    @IsNotEmpty()
    check_out_date: Date;

    @IsUUID()
    @IsNotEmpty()
    userId: string;

    @IsUUID()
    @IsNotEmpty()
    roomId: string;
     
    @IsArray()
    @ValidateNested()
    @Type(() => CompanionDto)
    companions: CompanionDto[]
}