import { Module } from '@nestjs/common';
import { ArticleController } from './controllers/article.controller';
import { ArticleService } from './services/article.service';
import { StatusService } from '../status/status.service';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from '../users/users.service';

import { ArticleCreateService } from './services/article-create.services';

@Module({
  imports: [
    // Если UsersService находится в модуле UsersModule, импортируйте его сюда:
    // UsersModule,  // Например, если UsersService находится в модуле UsersModule
  ],
  providers: [
    ArticleCreateService,
    StatusService,
    UsersService, // Убедитесь, что UsersService добавлен в providers
    PrismaService,
  ],
})
export class ArticleModule {}
