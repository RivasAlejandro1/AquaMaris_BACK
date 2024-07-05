import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User.entity";
import { Room } from "./Room.entity";
import { CommentStatus } from "src/enum/CommentsStatus.enum";


@Entity()
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.comments)
    user: User;

    @ManyToOne(() => Room, (room) => room.comment)
    room: Room;

    @Column({ type: "varchar" })
    comment: string;

    @Column({ type: "float" })
    rating: number;

    @Column({ type: "date" })
    comment_date: Date;

    @Column({
        type: "enum",
        enum: CommentStatus,
        default: CommentStatus.IN_REVISION
    })
    comment_status: CommentStatus;
}