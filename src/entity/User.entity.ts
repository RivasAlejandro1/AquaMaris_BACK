import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { MembershipStatus } from 'src/enum/MembershipStatus.enum';

@Entity()
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

  @Column('simple-array')
  roles: string;

  @Column({ length: 15 })
  phone: string;

  @Column('text')
  address: string;

  @Column('text', { nullable: true })
  user_photo: string;

  @Column({ type: 'enum', enum: MembershipStatus })
  membership_status: MembershipStatus;
}
