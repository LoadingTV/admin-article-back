import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity'; // Убедитесь, что путь к сущности User корректный
import { Image } from '../image/image.entity'; // Убедитесь, что путь к сущности Image корректный

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  article_id: number; // Идентификатор статьи

  @Column()
  title: string; // Заголовок статьи

  @Column()
  keyPoints: string; // Ключевые моменты статьи

  @Column({ unique: true }) // Уникальный slug
  slug: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date; // Дата создания статьи

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @Column()
  meta_description: string; // Мета-описание статьи

  @Column('text') // Измените тип на 'text', если контент может быть длинным
  content: string; // Содержимое статьи

  @ManyToOne(() => User, (user) => user.articles)
  author: User;

  @OneToMany(() => Image, (image) => image.article)
  images: Image[];
}
