import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  Logger,
  Get,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticleService } from './article.service';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ArticleResponse } from './article.interface';
import { diskStorage } from 'multer';
import { validateImageFile } from '../common/utils/file-validators';
import { Article } from './article.entity';

@Controller('/articles')
@UseGuards(ThrottlerGuard)
export class ArticleController {
  private readonly logger = new Logger(ArticleController.name);

  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './public/images',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}-${file.originalname}`);
        },
      }),
      fileFilter: validateImageFile,
    }),
  )
  async createArticle(
    @Body() articleData: CreateArticleDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<ArticleResponse> {
    try {
      // Логирование начала создания статьи
      this.logger.log({
        event: 'article_creation_started',
        title: articleData.title,
        slug: articleData.slug,
        content: articleData.content,
        faqs: articleData.faqs,
        filesCount: files.length,
        uploadedFiles: files.map((file) => file.originalname), // Логируем имена загружаемых файлов
      });

      const savedArticle = await this.articleService.saveArticleNew(
        articleData.title,
        articleData.keyPoints,
        articleData.slug,
        articleData.content,
        articleData.metaDescription,
        articleData.authorId,
        files,
        articleData.faqs,
      );

      // Логирование успешного завершения создания статьи
      this.logger.log({
        event: 'article_creation_completed',
        title: articleData.title,
        articleId: savedArticle.id, // Логируем ID созданной статьи
      });

      return {
        success: true,
        fileName: files.length
          ? files.map((file) => file.filename).join(', ')
          : 'No images uploaded',
        message: 'Article created successfully',
        article: savedArticle,
      };
    } catch (error) {
      // Логирование ошибки при создании статьи
      this.logger.error({
        event: 'article_creation_failed',
        error: error.message,
        title: articleData.title,
        stack: error.stack, // Логируем стек ошибки для более подробной информации
      });
      throw error;
    }
  }

  @Get('test')
  async testRoute(): Promise<string> {
    return 'Server is working!';
  }

  @Get('latest')
  async getLatestArticles(): Promise<Article[]> {
    this.logger.log({ event: 'fetch_latest_articles' });
    return this.articleService.findLatestArticles();
  }

  @Get()
  async getAllArticles(
    @Query('authorId') authorId?: number,
  ): Promise<Article[]> {
    this.logger.log({ event: 'fetch_all_articles' });
    return this.articleService.findAll(authorId);
  }

  @Get('by-author')
  async getArticlesByUserId(
    @Query('authorId', ParseIntPipe) authorId: number,
  ): Promise<Article[]> {
    this.logger.log({ event: 'fetch_articles_by_author' });
    return this.articleService.findByAuthorId(authorId);
  }

  @Get('count')
  async countArticlesByAuthor(
    @Query('authorId', ParseIntPipe) authorId: number,
  ): Promise<{ count: number }> {
    const count = await this.articleService.countArticlesByAuthorId(authorId);
    return { count };
  }

  @Get('by-author-status')
  async getArticlesByAuthorAndStatus(
    @Query('authorId', ParseIntPipe) authorId: number,
    @Query('statusId', ParseIntPipe) statusId?: number,
  ): Promise<Article[]> {
    this.logger.log({ event: 'fetch_articles_by_author_and_status' });
    return this.articleService.findByAuthorIdAndStatus(authorId, statusId);
  }

  @Get('count-by-status')
  async countArticlesByAuthorAndStatus(
    @Query('authorId', ParseIntPipe) authorId: number,
    @Query('statusId', ParseIntPipe) statusId?: number,
  ): Promise<{ count: number }> {
    const count = await this.articleService.countArticlesByAuthorAndStatus(
      authorId,
      statusId,
    );
    return { count };
  }
}
