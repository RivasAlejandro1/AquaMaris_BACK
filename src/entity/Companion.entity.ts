import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Booking } from './Booking.entity';
import { v4 as uuid } from 'uuid'

@Entity('companion')
export class Companion {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text'})
  identityCard: string;

  @ManyToOne(() => Booking, (booking) => booking.companions)
  booking: Booking;

}
