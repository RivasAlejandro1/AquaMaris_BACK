import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity('promotion')
export class Promotion {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ type: 'varchar', nullable: false })
  code: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'int', nullable: false })
  percentage: number;

  @Column({ type: 'int', nullable: false })
  available_uses: number;

  @Column({ type: 'varchar', nullable: false })
  state: string;
}
