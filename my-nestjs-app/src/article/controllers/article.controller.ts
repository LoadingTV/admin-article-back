import {
  Controller,
  Get,
  Param,
  Logger,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ArticleService } from '../services/article.service';

@Controller('articles')
export class ArticleController {
  private readonly logger = new Logger(ArticleController.name);

  constructor(private readonly articleService: ArticleService) {}

  // Fetch all articles
  @Get()
  async getAllArticles() {
    try {
      return await this.articleService.getAllArticles();
    } catch (error) {
      this.logger.error('Error while fetching articles', error.stack);
      throw new InternalServerErrorException('Failed to fetch articles');
    }
  }

  // Fetch articles by author
  @Get('author/:authorId')
  async getArticlesByAuthor(@Param('authorId') authorId: string) {
    try {
      const articles = await this.articleService.getArticlesByAuthor(authorId);
      if (!articles || articles.length === 0) {
        throw new NotFoundException('No articles found for this author');
      }
      return articles;
    } catch (error) {
      this.logger.error('Error while fetching articles by author', error.stack);
      throw new InternalServerErrorException(
        'Failed to fetch articles by author',
      );
    }
  }

  // Fetch the latest 10 articles
  @Get('latest')
  async getLatestArticles() {
    try {
      return await this.articleService.getLatestArticles();
    } catch (error) {
      this.logger.error('Error while fetching latest articles', error.stack);
      throw new InternalServerErrorException('Failed to fetch latest articles');
    }
  }
}
