import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // Импортируем PrismaService
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class StatusService {
  private readonly logger = new Logger(StatusService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Метод для получения статуса по ID
  async findStatusById(status_id: number) {
    try {
      const status = await this.prisma.status.findUnique({
        where: { status_id: status_id },
      });
      if (!status) {
        throw new NotFoundException('Status not found');
      }
      return status;
    } catch (error) {
      this.logger.error('Failed to fetch status by ID', error.stack);
      throw new InternalServerErrorException('Failed to fetch status');
    }
  }

  // Метод для получения статуса "Draft"
  async getDraftStatus() {
    try {
      const draftStatus = await this.prisma.status.findUnique({
        where: { name: 'Draft' },
      });
      if (!draftStatus) {
        throw new NotFoundException('Draft status not found');
      }
      return draftStatus;
    } catch (error) {
      this.logger.error('Failed to fetch draft status', error.stack);
      throw new InternalServerErrorException('Failed to fetch draft status');
    }
  }

  // Метод для обновления статуса статьи
  async updateStatus(articleId: number, statusId: number) {
    try {
      const article = await this.prisma.article.findUnique({
        where: { article_id: articleId },
        include: { status: true }, // Включаем связанный статус
      });
      if (!article) {
        throw new NotFoundException('Article not found');
      }

      const status = await this.prisma.status.findUnique({
        where: { status_id: statusId },
      });
      if (!status) {
        throw new NotFoundException('Status not found');
      }

      // Обновляем статус статьи
      const updatedArticle = await this.prisma.article.update({
        where: { article_id: articleId },
        data: {
          status_id: status.status_id,
        },
      });

      return updatedArticle;
    } catch (error) {
      this.logger.error('Failed to update article status', error.stack);
      throw new InternalServerErrorException('Failed to update article status');
    }
  }
}
