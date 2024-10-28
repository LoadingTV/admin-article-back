import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '../redis/redis.module'; // Импортируем RedisModule

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env.THROTTLE_TTL, 10) || 60,
        limit: parseInt(process.env.THROTTLE_LIMIT, 10) || 10,
      },
    ]),
    RedisModule, // Добавляем RedisModule сюда
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
