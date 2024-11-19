import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateArticleDto } from '../dto/create-article.dto';
import { StatusService } from '../../status/status.service';
import { UsersService } from '../../users/users.service';

@Injectable()
export class ArticleCreateService {
  private readonly logger = new Logger(ArticleCreateService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly statusService: StatusService,
    private readonly userService: UsersService,
  ) {}

  // Метод для создания статьи
  async createArticle(createArticleDto: CreateArticleDto) {
    const {
      article_id,
      author_id,
      status_id,
      meta_description,
      keyPoints,
      slug,
      image,
      faqs,
      ...articleData
    } = createArticleDto;

    let status;
    if (status_id) {
      status = await this.statusService.findStatusById(status_id);
      if (!status) {
        throw new InternalServerErrorException(
          `Status with ID ${status_id} not found`,
        );
      }
    } else {
      status = await this.statusService.getDraftStatus();
    }

    // Проверка на обязательные поля, если статус не черновик
    if (status.name !== 'Draft') {
      if (!articleData.title || !keyPoints || !slug || !articleData.content) {
        throw new InternalServerErrorException(
          'Required fields are missing: title, keyPoints, slug, or content',
        );
      }
    }

    // Если author_id не передан, генерируем ошибку
    let author;
    if (author_id) {
      author = await this.userService.getUserById(author_id); // Используем Prisma для поиска пользователя
      if (!author) {
        throw new InternalServerErrorException(
          `Author with ID ${author_id} not found`,
        );
      }
    } else {
      throw new InternalServerErrorException('Author is required');
    }

    let faqData = [];
    if (faqs && faqs.length > 0) {
      faqData = faqs.map((faq) => ({
        question: faq.question,
        answer: faq.answer,
      }));
    }

    try {
      const article = await this.prisma.article.upsert({
        where: {
          article_id: article_id || -1, // Если article_id не передан, создается новая статья
        },
        update: {
          ...articleData,
          keyPoints,
          slug,
          meta_description,
          author: {
            connect: { user_id: author.user_id },
          },
          status: {
            connect: { status_id: status.status_id },
          },
          image: image
            ? {
                create: {
                  url: image,
                },
              }
            : undefined,
          faqs: {
            create: faqData,
          },
        },
        create: {
          ...articleData,
          keyPoints,
          slug,
          meta_description,
          author: {
            connect: { user_id: author.user_id },
          },
          status: {
            connect: { status_id: status.status_id },
          },
          image: image
            ? {
                create: {
                  url: image,
                },
              }
            : undefined,
          faqs: {
            create: faqData,
          },
        },
      });

      this.logger.log(`Article created or updated successfully with ID: ${article.article_id}`);
      return article;
    } catch (error) {
      this.logger.error('Error while creating or updating article', error.stack);
      throw new InternalServerErrorException('Failed to create or update article');
    }
  }
}