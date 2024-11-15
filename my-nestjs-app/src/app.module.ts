import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ArticleModule } from './article/article.module';

import { ImageModule } from './image/image.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from '../prisma/prisma.service';
import { FaqModule } from './faq/faq.module';

@Module({
  imports: [UsersModule, ArticleModule, ImageModule, AuthModule, FaqModule],
  exports: [PrismaService],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
