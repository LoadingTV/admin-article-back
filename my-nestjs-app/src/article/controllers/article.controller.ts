import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Logger,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ArticleService } from '../services/article.service';
import { CreateArticleDto } from '../dto/create-article.dto';
import { ArticleCreateService } from '../services/article-create.services';

@Controller('articles')
export class ArticleController {
  private readonly logger = new Logger(ArticleController.name);

  constructor(
    private readonly articleService: ArticleService,
    private readonly articleCreateService: ArticleCreateService,
  ) {}

  @Post()
  async createArticle(@Body() createArticleDto: CreateArticleDto) {
    try {
      const article =
        await this.articleCreateService.createArticle(createArticleDto);
      this.logger.log(`Article created successfully: ${article.title}`);
      return article;
    } catch (error) {
      this.logger.error('Error while creating article', error.stack);
      throw new InternalServerErrorException('Failed to create article');
    }
  }

  // Получение всех статей
  @Get()
  async getAllArticles() {
    try {
      return await this.articleService.getAllArticles();
    } catch (error) {
      this.logger.error('Error while fetching articles', error.stack);
      throw new InternalServerErrorException('Failed to fetch articles');
    }
  }

  // Получение статьи по автору
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

  // Получение последних 10 статей
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
