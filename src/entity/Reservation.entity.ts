import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User.entity';
import { Room } from './Room.entity';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.reservations)
  user: User[];

  @Column('date')
  entrance: Date;

  @Column('date')
  exit: Date;

  @Column({ type: 'varchar', length: 100 })
  statePay: string;

  @ManyToOne(() => Room, (room) => room.reservations)
  @JoinColumn()
  room: Room[];

  /*  @Column()
    companions: ;
     */

  @Column({ type: 'simple-array', nullable: true })
  companions: any[];
}
