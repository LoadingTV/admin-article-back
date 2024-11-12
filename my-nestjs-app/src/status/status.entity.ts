import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Status')
export class Status {
  @PrimaryGeneratedColumn()
  status_id: number;

  @Column({ unique: true })
  name: string;
}
