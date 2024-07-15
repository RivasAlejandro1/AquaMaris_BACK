import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { CommentStatus } from "src/enum/CommentsStatus.enum";

export class ChangeCommentStatusDto{
    /**
   * ID del comentario al que se quiere realizar un cambio.
   */
    @IsUUID()
    @IsNotEmpty()
    commentId: string

        /**
   * Estatus que se le va a aplicar al comentario [APPROVED, DENIED, IN_REVISION]
   * @example APPROVED
   */
    @IsString()
    @IsNotEmpty()
    newStatus: CommentStatus
}