import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User.entity';
import { Room } from './Room.entity';
import { PaymentStatus } from '../enum/PaymentStatus.enum';
import { Companion } from './Companion.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.booking)
  user: User;

  @ManyToOne(() => Room, (room) => room.bookings)
  room: Room;

  @Column({ type: 'date', nullable: false })
  check_in_date: Date;

  @Column({ type: 'date', nullable: false })
  check_out_date: Date;

  @Column({ type: 'varchar', enum: PaymentStatus })
  paymentStatus: string;

  @OneToMany(() => Companion, (companion) => companion.booking)
  companions: Companion[];
}
