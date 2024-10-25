import { Controller, Post, Get } from '@nestjs/common';
import { ArticleService } from './article.service';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post('create')
  async createFile() {
    return this.articleService.createFile();
  }

  @Get('list')
  async listFiles() {
    return this.articleService.listFiles();
  }
}
