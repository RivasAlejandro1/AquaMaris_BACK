import { IsDateString, IsInt, Min } from "class-validator";

export class RegisterDateDto {
    @IsInt()
    @Min(1)
    months: number
}