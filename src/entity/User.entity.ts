import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { MembershipStatus } from 'src/enum/MembershipStatus.enum';
import { Booking } from './Booking.entity';

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

  @Column({ type: 'decimal' })
  phone: number;

  @Column({ type: 'varchar' })
  address: string;

  @Column({ type: 'varchar', nullable: true })
  user_photo: string;

  @Column({ type: 'varchar', enum: MembershipStatus })
  membership_status: MembershipStatus;

  @OneToMany(() => Booking, (booking) => booking.user)
  booking: Booking[];
}
