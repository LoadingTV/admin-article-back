import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Article } from './article.entity';
import { Image } from '../image/image.entity';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ArticleService {
  private readonly logger = new Logger(ArticleService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
    let author: User;
    try {
      author = await this.userRepository.findOne({
        where: {
          user_id: authorId,
        },
      });
    } catch (error) {
      this.logger.error('Error finding author', error.stack);
      throw new InternalServerErrorException('Error finding author');
    }

    if (!author) {
      this.logger.error(`Author with ID ${authorId} not found`);
      throw new InternalServerErrorException(
        `Author with ID ${authorId} not found`,
      );
    }

    const article = this.articleRepository.create({
      title,
      keyPoints,
      slug,
      content,
      meta_description: metaDescription,
      author,
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

  // Новый метод для получения всех статей
  async findAll(authorId?: number): Promise<Article[]> {
    try {
      const queryBuilder = this.articleRepository
        .createQueryBuilder('article')
        .leftJoinAndSelect('article.author', 'author')
        .leftJoinAndSelect('article.images', 'images');

      if (authorId) {
        queryBuilder.where('article.authorId = :authorId', { authorId });
      }

      return await queryBuilder.getMany();
    } catch (error) {
      this.logger.error('Failed to fetch articles', error.stack);
      throw new InternalServerErrorException('Failed to fetch articles');
    }
  }

  private async saveImages(
    files: Express.Multer.File[],
    article: Article,
    altText: string = 'Описание', // параметр для alt_text
  ): Promise<void> {
    for (const file of files) {
      const image = this.imageRepository.create({
        url: file.filename,
        caption: file.originalname,
        alt_text: altText,
        article,
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
