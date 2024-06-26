import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { MembershipStatus } from 'src/enum/MembershipStatus.enum';
<<<<<<< HEAD
import { v4 as uuid } from 'uuid';
=======
import { Reservation } from './Reservation.entity';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100 })
  email: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @Column({ length: 15 })
  phone: string;

  @Column('text')
  address: string;

  @Column('text', { nullable: true })
  user_photo: string;

  @Column({ type: 'enum', enum: MembershipStatus })
  membership_status: MembershipStatus;
}
