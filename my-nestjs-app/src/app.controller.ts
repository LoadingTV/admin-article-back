import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Новый маршрут для получения списка статей
  @Get('articles')
  getArticles(): string[] {
    return ['Article 1', 'Article 2', 'Article 3']; // Это пример, замените на вызов метода из вашего сервиса
  }

  // Новый маршрут для создания статьи
  @Post('articles')
  createArticle(
    @Body() createArticleDto: { title: string; content: string },
  ): string {
    return `Article titled "${createArticleDto.title}" created successfully.`;
  }
}
