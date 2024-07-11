import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { CommentStatus } from "src/enum/CommentsStatus.enum";

export class ChangeCommentStatusDto{
    @IsUUID()
    @IsNotEmpty()
    commentId: string

    @IsString()
    @IsNotEmpty()
    newStatus: CommentStatus
}