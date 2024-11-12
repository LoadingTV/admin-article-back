import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleCreationController } from './articleCreate.controller';
import { ArticleService } from './article.service';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './article.entity';
import { Image } from '../image/image.entity';
import { UserModule } from '../users/users.module';
import { FaqRepository } from '../faq/faq.repository';
// import { statusRepository } from '../status/status.repository';
import { FaqModule } from '../faq/faq.module';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    FaqModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: parseInt(config.get('THROTTLE_TTL'), 10) || 60,
          limit: parseInt(config.get('THROTTLE_LIMIT'), 10) || 10,
        },
      ],
    }),
    TypeOrmModule.forFeature([Article, Image]),
    UserModule,
  ],
  controllers: [ArticleController, ArticleCreationController],
  providers: [ArticleService, FaqRepository],
})
export class ArticleModule {}
