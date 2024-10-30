import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticleService } from './article.service';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ArticleResponse } from './article.interface';
import { diskStorage } from 'multer';
import { validateImageFile } from '../common/utils/file-validators';

@Controller('api/articles')
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
      this.logger.log({
        event: 'article_creation_started',
        title: articleData.title,
        filesCount: files?.length,
      });

      // Убираем проверку на наличие файлов
      // if (!files || files.length === 0) {
      //   throw new BadRequestException('At least one image is required');
      // }

      const savedArticle = await this.articleService.saveArticleNew(
        articleData.title,
        articleData.keyPoints,
        articleData.slug,
        articleData.content,
        articleData.metaDescription,
        articleData.authorId,
        files,
      );

      this.logger.log({
        event: 'article_creation_completed',
        title: articleData.title,
      });

      return {
        success: true,
        fileName: files
          ? files.map((file) => file.filename).join(', ')
          : 'No images uploaded', // Вернуть имена файлов или сообщение, если их нет
        message: 'Article created successfully',
        article: savedArticle,
      };
    } catch (error) {
      this.logger.error({
        event: 'article_creation_failed',
        error: error.message,
        title: articleData.title,
      });
      throw error;
    }
  }
}
