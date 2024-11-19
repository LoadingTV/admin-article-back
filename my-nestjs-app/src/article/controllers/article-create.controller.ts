import {
  Controller,
  Post,
  Body,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { ArticleCreateService } from '../services/article-create.services';
import { CreateArticleDto } from '../dto/create-article.dto';

@Controller('articles/create')
export class ArticleCreateController {
  private readonly logger = new Logger(ArticleCreateController.name);

  constructor(private readonly articleCreateService: ArticleCreateService) {}

  @Post('create')
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

  @Post('autosave')
  async autoSaveArticle(@Body() createArticleDto: CreateArticleDto) {
    try {
      const article = await this.articleCreateService.createArticle(createArticleDto);
      this.logger.log(`Article auto-saved successfully: ${article.title}`);
      return article;
    } catch (error) {
      this.logger.error('Error while autosaving article', error.stack);
      throw new InternalServerErrorException('Failed to autosave article');
    }
  }
}
