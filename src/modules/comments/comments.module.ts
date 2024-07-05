import { Module } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { CommentsController } from "./comments.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Comment } from "src/entity/Comment.entity";
import { User } from "src/entity/User.entity";
import { Room } from "src/entity/Room.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Comment, User, Room])],
    providers: [CommentsService],
    controllers: [CommentsController]
})
export class CommentsModule{}
