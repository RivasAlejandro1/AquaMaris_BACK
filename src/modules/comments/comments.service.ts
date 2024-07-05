import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CommentDto } from "src/dtos/Comment.dto";
import { Room } from "src/entity/Room.entity";
import { User } from "src/entity/User.entity";
import { CommentStatus } from "src/enum/CommentsStatus.enum";
import { Repository } from "typeorm";
import { Comment } from "src/entity/Comment.entity";

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment) private commentRepository: Repository<Comment>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Room) private roomRepository: Repository<Room>
    ) { }

    async commentsSeeder() {
        const user = await this.userRepository.find()
    }

    async getAllComments() {
        try {
            return await this.commentRepository.find()
        } catch (err) {
            console.log('Error getting all the comments', err)
            throw new InternalServerErrorException('Error getting all the comments')
        }
    }

    async getAllowedComments(){
        try{
            return await this.commentRepository.find({where: {comment_status: CommentStatus.APPROVED}})
        }catch(err){
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

            const regex = /\b(?:fuck|shit|bitch|asshole|damn|cunt|faggot|pussy|dick|bastard|crap|slut|whore|mierda|puta|pendejo|coño|gilipollas|cabrón|joder|maricón|chingar|hijo\s?de\s?puta)\b/i;

            function containsOffensiveWords(comment): boolean{
                return regex.test(comment)
            }

            const newComment = await this.commentRepository.create({
                comment,
                rating,
                comment_date: new Date(),
                comment_status: containsOffensiveWords(comment) ? CommentStatus.DENIED : CommentStatus.APPROVED,
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
}