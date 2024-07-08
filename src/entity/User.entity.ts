import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { MembershipStatus } from '../enum/MembershipStatus.enum';
import { Booking } from './Booking.entity';
import { Comment } from './Comment.entity';
import { RegisterCode } from './RegisterCodes';

@Entity({ name: 'users' })
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column()
  role: string;

  @Column({ type: 'decimal', nullable: true })
  phone: number;

  @Column({ type: 'varchar' })
  country: string;

  @Column({ type: 'varchar', nullable: true })
  user_photo: string;

  @Column({ type: 'varchar', enum: MembershipStatus, nullable: true })
  membership_status: MembershipStatus;

  @OneToMany(() => Booking, (booking) => booking.user)
  booking: Booking[];

  @Column({ default: true })
  status: boolean;

  @Column({ default: new Date() })
  date_start: Date;

  @Column({ default: '' })
  date_end: string;

  @OneToMany(()=> Comment, (comment) => comment.user)
  comments: Comment[]

  @OneToMany(()=> RegisterCode, (code) => code.user)
  registerCode: RegisterCode
}
