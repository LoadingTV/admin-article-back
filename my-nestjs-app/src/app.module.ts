import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/users.module';
import { ArticleModule } from './article/article.module';
import { User } from './users/user.entity';
import { Article } from './article/article.entity';
import { Image } from './image/image.entity';
import { ImageModule } from './image/image.module';
import { Role } from './users/role.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1351',
      database: 'nestjs_db',
      entities: [User, Article, Image, Role],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Article, Image, Role]),
    UserModule,
    ArticleModule,
    ImageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
