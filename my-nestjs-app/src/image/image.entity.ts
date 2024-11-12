import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Article } from '../article/article.entity';

@Entity('Image')
export class Image {
  @PrimaryGeneratedColumn()
  image_id: number;

  @Column()
  url: string;

  @Column()
  caption: string;

  @Column()
  alt_text: string;

  @ManyToOne(() => Article, (article) => article.images)
  article: Article;
}
