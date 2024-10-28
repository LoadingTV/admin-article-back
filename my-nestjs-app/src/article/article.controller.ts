// article.controller.ts
import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticleService } from './article.service';

@Controller('api/articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  async createArticle(
    @Body() articleData: CreateArticleDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      const fileName = articleData.title
        .toLowerCase()
        .replace(/[^a-zа-яё0-9]/gi, '-')
        .replace(/-+/g, '-');

      const htmlContent = this.articleService.generateHtmlContent(
        articleData,
        files,
      );

      await this.articleService.saveArticle(fileName, htmlContent);
      await this.articleService.saveImages(files);

      return {
        success: true,
        fileName: `${fileName}.html`,
      };
    } catch (error) {
      console.error('Error creating article:', error);
      throw new Error('Failed to create article');
    }
  }
}
