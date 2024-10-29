import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticleResponse } from './article.interface';
import { generateSlug } from '../common/utils/string-utils';
import { ConfigService } from '@nestjs/config';

import { PrismaClient } from '@prisma/client';

@Injectable()
export class ArticleService {
  private readonly logger = new Logger(ArticleService.name);
  private prisma = new PrismaClient();

  constructor(private readonly configService: ConfigService) {}

  async createArticle(
    articleData: CreateArticleDto,
    files: Express.Multer.File[],
  ): Promise<ArticleResponse> {
    const fileName = generateSlug(articleData.title);
    const htmlContent = this.generateHtmlContent(articleData, files);

    try {
      await this.saveArticle(fileName, htmlContent);

      // Сохранение в кэше
      await this.cacheArticle(fileName, htmlContent);

      this.logger.log({
        event: 'article_saved',
        fileName,
      });

      return {
        success: true,
        fileName: `${fileName}.html`,
        message: 'Article created successfully',
      };
    } catch (error) {
      this.logger.error('Failed to create article', error.stack);
      throw new InternalServerErrorException('Failed to create article');
    }
  }

  private generateHtmlContent(
    articleData: CreateArticleDto,
    files: Express.Multer.File[],
  ): string {
    // Убираем санитацию
    const rawText = articleData.text; // Используем текст без проверок

    return `<!DOCTYPE html>
      <html lang="ru">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="${articleData.metaDescription}">
        <title>${articleData.title}</title>
        <link rel="stylesheet" href="/styles/article.css">
      </head>
      <body>
        <article class="article-container">
          <header class="article-header">
            <h1>${articleData.title}</h1>
            <time datetime="${new Date().toISOString()}">${new Date().toLocaleDateString('ru-RU')}</time>
          </header>
          
          <div class="article-content">
            ${rawText}
          </div>
          
          <div class="article-gallery">
            ${files
              .map(
                (file) => `
              <figure>
                <img 
                  src="/images/${file.filename}" 
                  alt="${file.originalname}"
                  loading="lazy"
                  class="article-image"
                >
                <figcaption>${file.originalname}</figcaption>
              </figure>
            `,
              )
              .join('')}
          </div>
          
          ${
            articleData.link
              ? `
            <footer class="article-footer">
              <a href="${articleData.link}" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 class="source-link">
                Источник
              </a>
            </footer>
          `
              : ''
          }
        </article>
      </body>
      </html>`;
  }

  private async saveArticle(fileName: string, content: string): Promise<void> {
    const articlesDir = path.join(process.cwd(), 'public', 'articles');

    try {
      await fs.mkdir(articlesDir, { recursive: true });
      await fs.writeFile(
        path.join(articlesDir, `${fileName}.html`),
        content,
        'utf-8',
      );
    } catch (error) {
      this.logger.error({
        event: 'article_save_failed',
        error: error.message,
        fileName,
      });
      throw error;
    }
  }

  private async cacheArticle(fileName: string, content: string): Promise<void> {
    try {
      this.logger.log({
        event: 'article_cached',
        fileName,
      });
    } catch (error) {
      this.logger.error({
        event: 'article_cache_failed',
        error: error.message,
        fileName,
      });
      throw new InternalServerErrorException('Failed to cache article');
    }
  }

  //нет никаких проверок, предполагаю, что єто нужно засунуть в saveArticle, но пока так
  async saveArticleNew(
    title: string,
    keyPoints: string,
    slug: string,
    content: string,
    metaDescription: string,
    authorId: number,
  ) {
    return this.prisma.article.create({
      data: {
        title,
        keyPoints,
        slug,
        content,
        meta_description: metaDescription,
        created_at: new Date(),
        updated_at: new Date(), //тут нужно подумать как єто правильно сделать
        author: {
          connect: { user_id: authorId },
        },
        images: {
          //если картинки сейвятся сразу в папку, то как потом сопоставить картинки и описания, названия картинок
          //задаются автоматом? пока описание не передается в фукнцию
          create: [
            {
              url: 'image.jpg',
              caption: 'Описание',
              alt_text: 'Alt',
            },
          ],
        },
      },
    });
  }
}
