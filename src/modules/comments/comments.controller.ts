import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { CommentDto } from "src/dtos/Comment.dto";
import { ChangeCommentStatusDto } from "src/dtos/ChangeCommentStatus.dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Comments')
@Controller('comment')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { }

    @Get('seeder')
    commentSeeder(success: boolean){
        return this.commentsService.commentsSeeder()
    }

    @Post('')
    createNewComment(@Body() commentData: CommentDto) {
        return this.commentsService.createComment(commentData)
    }

    @Get()
    getAllowedComments(){
        return this.commentsService.getAllowedComments()
    }

    @Get('inrevision')
    getInRevisionComments(){
        return this.commentsService.getInRevisionComments()
    }

    @Get('denied')
    getDeniedComments(){
        return this.commentsService.getDeniedComments()
    }

    @Get('admin')
    getAllComments(){
        return this.commentsService.getAllComments()
    }

    @Get(":id")
    getCommentById(@Param('id', ParseUUIDPipe) id: string){
        return this.commentsService.getCommentsById(id)
    }

    @Put('')
    changeCommentStatus(@Body() commentData: ChangeCommentStatusDto){
        return this.commentsService.changeCommentStatus(commentData)
    }

    @Get('room/:roomId')
    getCommentsByRoomId(@Param('roomId') roomId: string){
        console.log(roomId)
        return this.commentsService.getCommentsByRoomId(roomId)
    }
}