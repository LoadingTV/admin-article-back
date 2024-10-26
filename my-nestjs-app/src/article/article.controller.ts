import { Controller, Post, Body, Get } from '@nestjs/common';
import { ArticleService } from './article.service';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post('create')
  async createFile(@Body('suffix') suffix: string) {
    return this.articleService.createFile(suffix);
  }

  @Get('list')
  async listFiles() {
    return this.articleService.listFiles();
  }
}
