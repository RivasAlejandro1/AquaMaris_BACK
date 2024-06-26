import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { MembershipStatus } from 'src/enum/MembershipStatus.enum';

@Entity({name:"users"})
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

}
