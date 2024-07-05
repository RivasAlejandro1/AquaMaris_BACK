import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Hotel } from './Hotel.entity';
import { Service } from './Service.entity';
import { Image } from './Image.entity';
import { Booking } from './Booking.entity';
import { Comment } from './Comment.entity'

@Entity({ name: 'room' })
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ type: 'varchar', length: 50, nullable: false })
  type: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: false })
  price: number;

  @Column({ type: 'varchar', length: 100 })
  description: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  state: string;

  @Column({ type: 'int' })
  roomNumber: number;

  @ManyToOne(() => Hotel, (hotel) => hotel.rooms)
  hotel: Hotel;

  @ManyToMany(() => Service)
  @JoinTable({
    name: 'room_services',
  })
  services: Service[];

  @OneToMany(() => Image, (image) => image.room)
  images: Image[];

  @OneToMany(() => Booking, (booking) => booking.room)
  bookings: Booking[];

  @OneToMany(() => Comment, (comment) => comment.room)
  comment: Comment[]
}
