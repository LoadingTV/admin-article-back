// src/user/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany,ManyToOne } from 'typeorm';
import { Article } from '../article/article.entity';
import { Role } from '../users/role.entity'; 

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number; // Идентификатор пользователя

  @Column()
  name: string; // Имя пользователя

  @Column()
  surname: string; // Фамилия пользователя

  @Column({ unique: true })
  email: string; // Email пользователя

  @Column()
  password: string; // Пароль пользователя

  @OneToMany(() => Article, (article) => article.author)
  articles: Article[];

  @ManyToOne(() => Role, (role) => role.users, { nullable: true })
  role: Role;
}
