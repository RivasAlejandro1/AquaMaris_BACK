import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CommentDto } from "src/dtos/Comment.dto";
import { Room } from "src/entity/Room.entity";
import { User } from "src/entity/User.entity";
import { CommentStatus } from "src/enum/CommentsStatus.enum";
import { Repository } from "typeorm";
import { Comment } from "src/entity/Comment.entity";
import * as comments from '../../utils/comments.data.json'
import { ChangeCommentStatusDto } from "src/dtos/ChangeCommentStatus.dto";

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment) private commentRepository: Repository<Comment>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Room) private roomRepository: Repository<Room>
    ) { }

    async commentsSeeder() {
        try {
            for (const comment of comments) {
                const existingUser = await this.userRepository
                    .createQueryBuilder('user')
                    .where('user.name = :name', { name: comment.name })
                    .getOne();

                if (!existingUser)
                    throw new NotFoundException(`User with name ${comment.name} not found`);

                const existingRoom = await this.roomRepository
                    .createQueryBuilder('room')
                    .where('room.roomNumber = :roomNumber', { roomNumber: comment.roomId })
                    .getOne();

                if (!existingRoom)
                    throw new NotFoundException(`Room with number ${comment.roomId} not found`);

                const existingComment = await this.commentRepository
                    .createQueryBuilder('comment')
                    .where('comment.user = :user', { user: existingUser.id })
                    .andWhere('comment.room = :room', { room: existingRoom.id })
                    .getOne();

                if (existingComment) {
                    console.log(
                        `Comment for user ${comment.name} in room ${comment.roomId} already exists`
                    );
                    continue;
                }

                const newComment = this.commentRepository.create({
                    user: existingUser,
                    room: existingRoom,
                    comment: comment.comments,
                    rating: comment.rating,
                    comment_date: comment.comment_date,
                    comment_status: CommentStatus.APPROVED,
                });

                await this.commentRepository.save(newComment);
            }
            return true;
        } catch (err) {
            console.log('Error seeding comments data', err);
            throw new Error('Error seeding comments data');
        }
    }


    async changeCommentStatus(commentData: ChangeCommentStatusDto){
        const { commentId, newStatus } = commentData
        try {
            const comment = await this.commentRepository.findOne({where: {id: commentId}})
            comment.comment_status = newStatus

            await this.commentRepository.save(comment)

            return {
                message: `Comment ${commentId} has changed the status to ${newStatus} `
            }
        }catch(err){
            console.log(`Error changing comment with id ${commentId}: `, err)
            throw new InternalServerErrorException(`Error changing comment with id ${commentId}`)
        }
    }

    async getAllComments() {
        try {
            return await this.commentRepository.find()
        } catch (err) {
            console.log('Error getting all the comments', err)
            throw new InternalServerErrorException('Error getting all the comments')
        }
    }

    async getAllowedComments() {
        try {
            return await this.commentRepository.find({ where: { comment_status: CommentStatus.APPROVED } })
        } catch (err) {
            console.log(`Error getting all the allowed comments`, err)
            throw new InternalServerErrorException(`Error getting all the allowed comments`)
        }
    }

    async getCommentsById(id: string) {
        try {
            const user = await this.userRepository.findOne({
                where: { id },
                relations: ['comments'],
            });

            if (!user) throw new NotFoundException(`User with id ${id} not found`)

            return user.comments
        } catch (err) {
            console.log(`Could not get user by id ${id}`, err)
            throw new InternalServerErrorException(`Could not get user by id ${id}`)
        }
    }

    async createComment(commentData: CommentDto) {
        const { userId, roomId, comment, rating } = commentData
        try {
            const existingUser = await this.userRepository.findOneBy({ id: userId });
            if (!existingUser) {
                throw new NotFoundException(`User with id ${userId} was not found`);
            }

            const existingRoom = await this.roomRepository.findOne({ where: { id: roomId } });
            if (!existingRoom) {
                throw new NotFoundException(`Room with id ${roomId} was not found`);
            }


            const newComment = await this.commentRepository.create({
                comment,
                rating,
                comment_date: new Date(),
                comment_status: CommentStatus.IN_REVISION,
                user: existingUser,
                room: existingRoom,
            });

            await this.commentRepository.save(newComment);

            return newComment
        } catch (err) {
            console.log(`Could create and commeto to user with id ${userId} and reservation room ${roomId}`, err)
            throw new InternalServerErrorException(`Could create and commeto to user with id ${userId} and reservation room ${roomId}`)
        }
    }

    async getCommentsByRoomId(roomId: string){
        try{
            const room = await this.roomRepository.findOne({where: {id: roomId}})
            return {"comments" :room.comment}
        }catch(err){
            console.log(`Error getting comments by room id ${roomId}`, err)
            throw new InternalServerErrorException(`Error getting comments by room id ${roomId}`)
        }
    }
}