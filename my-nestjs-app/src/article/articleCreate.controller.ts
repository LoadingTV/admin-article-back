import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  Logger,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticleService } from './article.service';
import { ArticleResponse } from './article.interface';
import { diskStorage } from 'multer';
import { validateImageFile } from '../common/utils/file-validators';

@Controller('/articles/create')
export class ArticleCreationController {
  private readonly logger = new Logger(ArticleCreationController.name);

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
    @UploadedFiles() files?: Express.Multer.File[], // Сделаем files опциональным
  ): Promise<ArticleResponse> {
    try {
      // Логирование начала создания статьи
      this.logger.log({
        event: 'article_creation_started',
        title: articleData.title,
        slug: articleData.slug,
        content: articleData.content,
        faqs: articleData.faqs,
        filesCount: files ? files.length : 0, // Проверка на наличие files
        uploadedFiles: files ? files.map((file) => file.originalname) : [], // Логируем имена файлов, если они есть
      });

      // Передаем authorId и файлы отдельно
      const savedArticle = await this.articleService.saveArticleNew(
        articleData.title,
        articleData.keyPoints,
        articleData.slug,
        articleData.content,
        articleData.metaDescription || 'metaDescription',
        articleData.authorId, // Передаем authorId как число
        files || [], // Массив файлов
        articleData.faqs || [], // Массив вопросов и ответов
      );

      // Логирование успешного завершения создания статьи
      this.logger.log({
        event: 'article_creation_completed',
        title: articleData.title,
        articleId: savedArticle.id,
      });

      return {
        success: true,
        fileName:
          files && files.length
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
        stack: error.stack,
      });
      throw error;
    }
  }
}
