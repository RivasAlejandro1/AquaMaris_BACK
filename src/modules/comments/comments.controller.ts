import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { CommentDto } from "src/dtos/Comment.dto";

@Controller('comment')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { }

    @Post('')
    createNewComment(@Body() commentData: CommentDto) {
        return this.commentsService.createComment(commentData)
    }

    @Get()
    getAllComments(){
        return this.commentsService.getAllComments()
    }

    @Get(":id")
    getCommentById(@Param('id', ParseUUIDPipe) id: string){
        return this.commentsService.getCommentsById(id)
    }
}