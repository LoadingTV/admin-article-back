import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Status {
  @PrimaryGeneratedColumn()
  status_id: number;

  @Column({ unique: true })
  name: string;
}
