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
      images,
      faqs,
      ...articleData
    } = createArticleDto;

    // Проверка на обязательные поля
    if (!meta_description || !keyPoints || !slug) {
      throw new InternalServerErrorException(
        'Missing required fields: meta_description, keyPoints, or slug',
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

    // Преобразуем массив строк в структуру, соответствующую ImageCreateNestedManyWithoutArticleInput
    let imageData = [];
    if (images && images.length > 0) {
      imageData = images.map((imageUrl) => ({
        image_url: imageUrl, // Используйте соответствующее поле в вашей модели изображения
      }));
    }

    // Преобразуем массив строк в объекты для FAQ
    let faqData = [];
    if (faqs && faqs.length > 0) {
      faqData = faqs.map((faq) => ({
        question: faq, // Используйте соответствующие поля для FAQ, если это вопросы/ответы
        answer: '', // Можно оставить пустым, если только вопрос нужен
      }));
    }

    // Создаем статью с использованием Prisma
    try {
      const article = await this.prisma.article.create({
        data: {
          ...articleData, // Это должны быть поля, которые вы передаете для создания статьи
          keyPoints, // Убедитесь, что передаете keyPoints
          slug, // Убедитесь, что передаете slug
          meta_description, // Убедитесь, что передаете meta_description
          author: {
            connect: { user_id: author.user_id }, // Связь с автором через Prisma
          },
          status: {
            connect: { status_id: status.status_id }, // Связь со статусом через Prisma
          },
          images: {
            create: imageData, // Добавляем изображения в статью
          },
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
