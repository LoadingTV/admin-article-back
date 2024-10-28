// article.service.ts
import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { CreateArticleDto } from './dto/create-article.dto';
import { Express } from 'express';

@Injectable()
export class ArticleService {
  private readonly logger = new Logger(ArticleService.name);

  // Генерация HTML контента
  generateHtmlContent(
    articleData: CreateArticleDto,
    files: Express.Multer.File[],
  ): string {
    return `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${articleData.metaDescription}">
    <title>${articleData.title}</title>
</head>
<body>
    <article>
        <h1>${articleData.title}</h1>
        ${articleData.text}
        ${files.map((file) => `<img src="/images/${file.filename}" alt="${file.originalname}">`).join('\n')}
        ${articleData.link ? `<a href="${articleData.link}">Источник</a>` : ''}
    </article>
</body>
</html>`;
  }

  // Сохранение статьи
  async saveArticle(fileName: string, content: string): Promise<void> {
    const articlesDir = path.join(process.cwd(), 'public', 'articles');
    await fs.mkdir(articlesDir, { recursive: true });
    await fs.writeFile(
      path.join(articlesDir, `${fileName}.html`),
      content,
      'utf-8',
    );
  }

  // Сохранение изображений
  async saveImages(files: Express.Multer.File[]): Promise<void> {
    if (files.length > 0) {
      const imagesDir = path.join(process.cwd(), 'public', 'images');
      await fs.mkdir(imagesDir, { recursive: true });

      await Promise.all(
        files.map((file) =>
          fs.writeFile(path.join(imagesDir, file.filename), file.buffer),
        ),
      );
    }
  }
}
