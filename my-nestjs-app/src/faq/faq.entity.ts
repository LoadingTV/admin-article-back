import { Entity, Column, PrimaryGeneratedColumn,ManyToOne } from 'typeorm';
import { Article } from '../article/article.entity'; 

@Entity()
export class Faq {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  question: string;

  @Column()
  answer: string;

  @ManyToOne(() => Article, (article) => article.faqs) 
  article: Article; 
}