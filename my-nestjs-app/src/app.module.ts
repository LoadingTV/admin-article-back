import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ArticleModule } from './article/article.module';
import { StatusModule } from './status/status.module';
import { ImageModule } from './image/image.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from '../prisma/prisma.service';
import { FaqModule } from './faq/faq.module';
import { ArticleCreateController } from 'article/controllers/article-create.controller';
import { ArticleCreateService } from 'article/services/article-create.services';

@Module({
  imports: [
    UsersModule,
    ArticleModule,
    ImageModule,
    AuthModule,
    StatusModule,
    FaqModule,
  ],
  exports: [PrismaService],
  controllers: [ArticleCreateController, AppController],
  providers: [AppService, ArticleCreateService, PrismaService],
})
export class AppModule {}
