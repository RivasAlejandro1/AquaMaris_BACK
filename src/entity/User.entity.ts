import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { MembershipStatus } from 'src/enum/MembershipStatus.enum';
import { v4 as uuid } from 'uuid';
import { Reservation } from './Reservation.entity';
2
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
   
  @Column({default: true})
  status:boolean;

  @Column({default: new Date})
  date_start: Date;

  @Column({default:""})
  date_end: string; 

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservations: Reservation[] 
}
