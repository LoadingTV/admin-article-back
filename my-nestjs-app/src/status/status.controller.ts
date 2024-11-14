import { Controller, Put, Param, Body, ParseIntPipe } from '@nestjs/common';
import { StatusService } from './status.service';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Article } from '@prisma/client';

@Controller('statuses')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Put(':articleId/status')
  async updateArticleStatus(
    @Param('articleId', ParseIntPipe) articleId: number,
    @Body() updateStatusDto: UpdateStatusDto,
  ): Promise<Article> {
    const { statusId } = updateStatusDto;
    return this.statusService.updateStatus(articleId, statusId);
  }
}
