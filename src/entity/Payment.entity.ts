import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Booking } from './Booking.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'numeric', nullable: false })
  mercadoPagoId: number;
  @Column({ type: 'numeric', nullable: false })
  total: number;
  @Column({ type: 'date', nullable: false })
  paymentDate: Date;
  @Column({ type: 'varchar', length: 50 })
  paymentMethod: string;
  @Column({ type: 'varchar', length: 50, nullable: false })
  paymentState: string;
  /* @OneToOne(() => Booking)
  @JoinColumn()
  booking: Booking; */
}
