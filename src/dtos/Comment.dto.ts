import { IsNotEmpty, IsNumber, IsString, IsUUID, Max, Min } from "class-validator";

export class CommentDto{
    @IsUUID()
    @IsNotEmpty()
    userId: string

    @IsUUID()
    @IsNotEmpty()
    roomId: string

    @IsNotEmpty()
    @IsString()
    comment: string

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(5)
    rating: number
}