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
      author_id,
      status_id,
      meta_description,
      keyPoints,
      slug,
      image,
      faqs,
      ...articleData
    } = createArticleDto;

    // Проверка на обязательные поля
    if (!meta_description || !keyPoints || !slug || !image) {
      throw new InternalServerErrorException(
        'Missing required fields: meta_description, keyPoints, slug or image',
      );
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

    // Если status_id не передан, присваиваем статус Draft
    let status;
    if (status_id) {
      status = await this.statusService.findStatusById(status_id); // Используем Prisma для поиска статуса
      if (!status) {
        throw new InternalServerErrorException(
          `Status with ID ${status_id} not found`,
        );
      }
    } else {
      status = await this.statusService.getDraftStatus(); // Используем Prisma для получения статуса Draft
    }

    let faqData = [];
    if (faqs && faqs.length > 0) {
      faqData = faqs.map((faq) => ({
        question: faq.question,
        answer: faq.answer,
      }));
    }

    try {
      const article = await this.prisma.article.create({
        data: {
          ...articleData,
          keyPoints,
          slug,
          meta_description, // Убедитесь, что передаете meta_description
          author: {
            connect: { user_id: author.user_id }, // Связь с автором через Prisma
          },
          status: {
            connect: { status_id: status.status_id }, // Связь со статусом через Prisma
          },
          image: image // Устанавливаем связь с одним изображением
          ? {
              create: {
                url: image,
              },
            }
          : undefined,
          faqs: {
            create: faqData, // Добавляем вопросы/ответы в статью
          },
        },
      });

      this.logger.log(
        `Article created successfully with ID: ${article.article_id}`,
      );
      return article;
    } catch (error) {
      this.logger.error('Error while creating article', error.stack);
      throw new InternalServerErrorException('Failed to create article');
    }
  }
}
