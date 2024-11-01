import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity'; 
import { Image } from '../image/image.entity'; 
import { Status } from '../status/status.entity'; 

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  article_id: number;

  @Column()
  title: string;

  @Column()
  keyPoints: string;

  @Column({ unique: true })
  slug: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @Column()
  meta_description: string;

  @Column('text')
  content: string;

  @ManyToOne(() => User, (user) => user.articles)
  author: User;

  @OneToMany(() => Image, (image) => image.article)
  images: Image[];

  @ManyToOne(() => Status)
  status: Status;
}
