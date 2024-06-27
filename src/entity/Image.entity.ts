import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Room } from './Room.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();
  @Column({ type: 'varchar', nullable: false })
  url: string;
  @Column({ type: 'date', default: new Date() })
  date: Date;

  @ManyToOne(() => Room, (room) => room.images)
  room: Room;
}
