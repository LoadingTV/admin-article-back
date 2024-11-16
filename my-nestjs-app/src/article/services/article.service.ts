import {
  Injectable,
  Logger,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateArticleDto } from '../dto/create-article.dto';
import { Article } from '@prisma/client'; 
import { truncateKeyPoints } from '../utils/truncate-key-points.util'; 

@Injectable()
export class ArticleService {
  private readonly logger = new Logger(ArticleService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Получение всех статей
  async getAllArticles(): Promise<Article[]> {
    try {
      this.logger.log('Fetching all articles');
      const articles = await this.prisma.article.findMany();

      if (articles.length === 0) {
        this.logger.warn('No articles found');
      } else {
        this.logger.log(`Fetched ${articles.length} articles`);
      }

      const truncatedArticles = articles.map((article) => ({ //тут происходит обрезание :)
        ...article,
        keyPoints: truncateKeyPoints(article.keyPoints, 250),
      }));

      return truncatedArticles;
    } catch (error) {
      this.logger.error('Error while fetching articles', error.stack);
      throw new InternalServerErrorException('Failed to fetch articles');
    }
  }

  // Получение статей по автору
  async getArticlesByAuthor(authorId: string): Promise<Article[]> {
    try {
      this.logger.log(`Fetching articles for author with ID: ${authorId}`);
      const articles = await this.prisma.article.findMany({
        where: { author_id: parseInt(authorId, 10) }, // Convert string to number
      });

      if (articles.length === 0) {
        this.logger.warn(`No articles found for author with ID: ${authorId}`);
      } else {
        this.logger.log(
          `Fetched ${articles.length} articles for author ${authorId}`,
        );
      }

      return articles;
    } catch (error) {
      this.logger.error(
        `Error while fetching articles by author ${authorId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to fetch articles by author',
      );
    }
  }

  // Получение последних 10 статей
  async getLatestArticles(): Promise<Article[]> { // + картинка ключи
    try {
      this.logger.log('Fetching latest 10 articles');
      const articles = await this.prisma.article.findMany({
        take: 10,
        orderBy: {
          created_at: 'desc',
        },
        include: {
          image: true, 
        },
      });

      if (articles.length === 0) {
        this.logger.warn('No latest articles found');
      } else {
        this.logger.log(`Fetched ${articles.length} latest articles`);
      }

      const truncatedArticles = articles.map((article) => ({ //тут происходит обрезание :)
        ...article,
        keyPoints: truncateKeyPoints(article.keyPoints, 250),
      }));

      return truncatedArticles;
    } catch (error) {
      this.logger.error('Error while fetching latest articles', error.stack);
      throw new InternalServerErrorException('Failed to fetch latest articles');
    }
  }

  // Получение статьи по ID
  async getArticleById(articleId: number): Promise<Article> { //картинку
    try {
      this.logger.log(`Fetching article with ID: ${articleId}`);
      const article = await this.prisma.article.findUnique({
        where: { article_id: articleId }, // Используем правильное поле для primary key
      });

      if (!article) {
        this.logger.warn(`Article with ID ${articleId} not found`);
        throw new NotFoundException('Article not found');
      }

      this.logger.log(`Fetched article with ID: ${articleId}`);
      return article;
    } catch (error) {
      this.logger.error(
        `Error while fetching article with ID: ${articleId}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to fetch article');
    }
  }
}
