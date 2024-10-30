import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Article } from './article.entity';
import { Image } from '../image/image.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadImageDto } from './dto/upload-image.dto'; // без .ts

@Injectable()
export class ArticleService {
  private readonly logger = new Logger(ArticleService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  async saveArticleNew(
    title: string,
    keyPoints: string,
    slug: string,
    content: string,
    metaDescription: string,
    authorId: number,
    files: Express.Multer.File[],
  ): Promise<Article> {
    const article = this.articleRepository.create({
      title,
      keyPoints,
      slug,
      content,
      meta_description: metaDescription,
      author: { id: authorId },
    });

    let savedArticle: Article;
    try {
      savedArticle = await this.articleRepository.save(article);
    } catch (error) {
      this.logger.error('Failed to save article', error.stack);
      throw new InternalServerErrorException('Failed to save article');
    }

    if (files && files.length > 0) {
      await this.saveImages(files, savedArticle);
    }

    return savedArticle;
  }

  private async saveImages(
    files: Express.Multer.File[],
    article: Article,
  ): Promise<void> {
    for (const file of files) {
      const image = this.imageRepository.create({
        url: file.filename,
        caption: file.originalname,
        alt_text: 'Описание',
        article, // Устанавливаем объект статьи
      });

      try {
        await this.imageRepository.save(image);
      } catch (error) {
        this.logger.error('Failed to save image', error.stack);
        throw new InternalServerErrorException('Failed to save image');
      }
    }
  }
}
