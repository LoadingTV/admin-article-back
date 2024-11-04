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
import { Status } from './status/status.entity';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from '../prisma/prisma.service';
import { FaqModule } from './faq/faq.module';
import { Faq } from './faq/faq.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'postgres',
      password: 'loading1351',
      database: 'postgres',
      entities: [User, Article, Image, Role, Status, Faq],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Article, Image, Role, Status]),
    UserModule,
    ArticleModule,
    ImageModule,
    AuthModule,
    FaqModule,
  ],
  exports: [PrismaService],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
