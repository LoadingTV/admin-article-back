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
import { FaqRepository } from '../faq/faq.repository';

@Injectable()
export class ArticleService {
  private readonly logger = new Logger(ArticleService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly faqRepository: FaqRepository,
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
    faqs: { question: string; answer: string }[],
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
      status_id: 1,
    });

    try {
      const savedArticle = await this.articleRepository.save(article);

      if (faqs && faqs.length > 0) {
        const faqEntities = faqs.map((faq) => ({
          question: faq.question,
          answer: faq.answer,
          article: savedArticle,
        }));

        await this.faqRepository.save(faqEntities);
      }

      return savedArticle;
    } catch (error) {
      this.logger.error('Error saving article', error.stack);
      throw new InternalServerErrorException('Error saving article');
    }
  }

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

  async findByAuthorId(authorId: number): Promise<Article[]> {
    try {
      const articles = await this.articleRepository
        .createQueryBuilder('article')
        .leftJoinAndSelect('article.author', 'author')
        .leftJoinAndSelect('article.images', 'images')
        .select([
          'article.article_id',
          'article.title',
          'article.keyPoints',
          'article.slug',
          'article.created_at',
          'article.updated_at',
          'article.meta_description',
          'article.content',
          'author.name',
          'author.surname',
          'images.image_id',
          'images.url',
          'images.caption',
          'images.alt_text',
        ])
        .where('author.user_id = :authorId', { authorId })
        .getMany();
      return articles;
    } catch (error) {
      this.logger.error('Failed to fetch articles by author', error.stack);
      throw new InternalServerErrorException(
        'Failed to fetch articles by author',
      );
    }
  }

  async countArticlesByAuthorId(authorId: number): Promise<number> {
    try {
      return await this.articleRepository.count({
        where: { author: { user_id: authorId } },
      });
    } catch (error) {
      this.logger.error('Failed to count articles by author', error.stack);
      throw new InternalServerErrorException(
        'Failed to count articles by author',
      );
    }
  }

  async findByAuthorIdAndStatus(
    authorId?: number,
    statusId?: number,
  ): Promise<Article[]> {
    try {
      const queryBuilder = this.articleRepository
        .createQueryBuilder('article')
        .leftJoinAndSelect('article.author', 'author')
        .leftJoinAndSelect('article.images', 'images')
        .leftJoinAndSelect('article.status', 'status');

      if (authorId) {
        queryBuilder.andWhere('article.author.user_id = :authorId', {
          authorId,
        });
      }
      if (statusId) {
        queryBuilder.andWhere('article.status.status_id = :statusId', {
          statusId,
        });
      }

      return await queryBuilder.getMany();
    } catch (error) {
      this.logger.error(
        'Failed to fetch articles by author and status',
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to fetch articles by author and status',
      );
    }
  }

  async countArticlesByAuthorAndStatus(
    authorId: number,
    statusId?: number,
  ): Promise<number> {
    try {
      const queryBuilder = this.articleRepository
        .createQueryBuilder('article')
        .leftJoin('article.author', 'author')
        .where('author.user_id = :authorId', { authorId });

      if (statusId) {
        queryBuilder.andWhere('article.status.status_id = :statusId', {
          statusId,
        });
      }

      return await queryBuilder.getCount();
    } catch (error) {
      this.logger.error(
        'Failed to count articles by author and status',
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to count articles by author and status',
      );
    }
  }

  async findLatestArticles(): Promise<Article[]> {
    try {
      return await this.articleRepository.find({
        order: { created_at: 'DESC' },
        take: 10,
        relations: ['images', 'author'],
      });
    } catch (error) {
      this.logger.error('Failed to fetch latest articles', error.stack);
      throw new InternalServerErrorException('Failed to fetch latest articles');
    }
  }

  private async saveImages(
    files: Express.Multer.File[],
    article: Article,
    altText: string = 'Описание',
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
