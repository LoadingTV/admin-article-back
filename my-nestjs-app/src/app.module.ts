import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ArticleModule } from './article/article.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [UsersModule, ArticleModule, RedisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
