import { Injectable, InternalServerErrorException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '../article/article.entity'; 
import { Status } from './status.entity'; 
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class StatusService {
  private readonly logger = new Logger(StatusService.name);

  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>, 
  ) {}

  async updateStatus(articleId: number, statusId: number): Promise<Article> {
    try {
      const article = await this.articleRepository.findOne({ where: { article_id: articleId }, relations: ['status'] });
      if (!article) {
        throw new NotFoundException('Article not found');
      }
      const status = await this.statusRepository.findOne({ where: { status_id: statusId } }); 
      if (!status) {
        throw new NotFoundException('Status not found');
      }
  
      article.status = status; 
      await this.articleRepository.save(article);
  
      return article;
    } catch (error) {
      this.logger.error('Failed to update article status', error.stack);
      throw new InternalServerErrorException('Failed to update article status');
    }
  }
}
