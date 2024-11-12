import {
  Controller,
  Get,
  Query,
  ParseIntPipe,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { Article } from './article.entity';
import { BadRequestException } from '@nestjs/common';

@Controller('/articles')
export class ArticleController {
  private readonly logger = new Logger(ArticleController.name);

  constructor(private readonly articleService: ArticleService) {}

  @Get('test')
  async testRoute(): Promise<string> {
    return 'Server is working!';
  }

  @Get('latest')
  async getLatestArticles(): Promise<Article[]> {
    this.logger.log({ event: 'fetch_latest_articles' });
    try {
      return await this.articleService.findLatestArticles();
    } catch (error) {
      this.logger.error('Error fetching latest articles', error.stack);
      throw new NotFoundException('Failed to fetch latest articles');
    }
  }

  @Get()
  async getAllArticles(
    @Query('authorId') authorId?: string,
  ): Promise<Article[]> {
    this.logger.log({ event: 'fetch_all_articles' });
    try {
      if (authorId) {
        const parsedAuthorId = parseInt(authorId, 10);
        if (isNaN(parsedAuthorId)) {
          throw new BadRequestException('Invalid authorId');
        }
        return await this.articleService.findAll(parsedAuthorId);
      }
      return await this.articleService.findAll();
    } catch (error) {
      this.logger.error('Error fetching all articles', error.stack);
      throw new NotFoundException('Failed to fetch articles');
    }
  }

  @Get('by-author')
  async getArticlesByUserId(
    @Query('authorId', ParseIntPipe) authorId: number,
  ): Promise<Article[]> {
    this.logger.log({ event: 'fetch_articles_by_author' });
    try {
      return await this.articleService.findByAuthorId(authorId);
    } catch (error) {
      this.logger.error(
        `Error fetching articles by author ${authorId}`,
        error.stack,
      );
      throw new NotFoundException(`No articles found for author ${authorId}`);
    }
  }

  @Get('count')
  async countArticlesByAuthor(
    @Query('authorId', ParseIntPipe) authorId: number,
  ): Promise<{ count: number }> {
    try {
      const count = await this.articleService.countArticlesByAuthorId(authorId);
      return { count };
    } catch (error) {
      this.logger.error(
        `Error counting articles for author ${authorId}`,
        error.stack,
      );
      throw new NotFoundException(
        `Failed to count articles for author ${authorId}`,
      );
    }
  }

  @Get('by-author-status')
  async getArticlesByAuthorAndStatus(
    @Query('authorId', ParseIntPipe) authorId: number,
    @Query('statusId', ParseIntPipe) statusId?: number,
  ): Promise<Article[]> {
    this.logger.log({ event: 'fetch_articles_by_author_and_status' });
    try {
      return await this.articleService.findByAuthorIdAndStatus(
        authorId,
        statusId,
      );
    } catch (error) {
      this.logger.error(
        `Error fetching articles by author ${authorId} and status ${statusId}`,
        error.stack,
      );
      throw new NotFoundException(
        'Failed to fetch articles by author and status',
      );
    }
  }

  @Get('count-by-status')
  async countArticlesByAuthorAndStatus(
    @Query('authorId', ParseIntPipe) authorId: number,
    @Query('statusId', ParseIntPipe) statusId?: number,
  ): Promise<{ count: number }> {
    try {
      const count = await this.articleService.countArticlesByAuthorAndStatus(
        authorId,
        statusId,
      );
      return { count };
    } catch (error) {
      this.logger.error(
        `Error counting articles by author ${authorId} and status ${statusId}`,
        error.stack,
      );
      throw new NotFoundException(
        'Failed to count articles by author and status',
      );
    }
  }
}
