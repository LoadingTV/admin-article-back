import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ArticleModule } from './article/article.module';
import { User } from './users/user.entity';
import { Article } from './article/article.entity';
import { Image } from './image/image.entity';
import { ImageModule } from './image/image.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1351',
      database: 'nestjs_db',
      entities: [User, Article, Image],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Article, Image]),
    UsersModule,
    ArticleModule,
    ImageModule, // Подключаем модуль Image
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
