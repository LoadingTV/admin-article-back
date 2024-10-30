// src/user/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Article } from '../article/article.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number; // Идентификатор пользователя

  @Column()
  name: string; // Имя пользователя

  @Column({ unique: true })
  email: string; // Email пользователя

  @Column()
  password: string; // Пароль пользователя

  @OneToMany(() => Article, (article) => article.author)
  articles: Article[];
}
