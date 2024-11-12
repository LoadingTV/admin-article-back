/*import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FAQ } from '@prisma/client';
import { CreateFaqDto } from './dto/faq.dto';

@Injectable()
export class FaqRepository {
  constructor(private prisma: PrismaService) { }

  async create(faqData: CreateFaqDto): Promise<FAQ> {

    // Выводим данные, которые получили на вход
    console.log('Received FAQ data:', faqData)

    console.log('article_id to search for:', faqData.article_id);
    // Проверяем, существует ли статья с таким article_id
    const articleExists = await this.prisma.article.findUnique({
      where: { article_id: faqData.article_id },
    });

    console.log('сейчас упадем...');
    if (!articleExists) {
      throw new Error(`Article with id ${faqData.article_id} does not exist`);
    }
    // Если статья существует, создаем FAQ
    return this.prisma.fAQ.create({
      data: faqData,
    });
  }

  async findAll(): Promise<FAQ[]> {
    return this.prisma.fAQ.findMany();
  }

  async save(
    faqEntities: {
      question: string;
      answer: string;
      article_id: number;
    }[],
  ): Promise<FAQ[]> {
    const createdFaqs = await Promise.all(
      faqEntities.map((faq) =>
        this.create({
          question: faq.question,
          answer: faq.answer,
          article_id: faq.article_id,
        }),
      ),
    );
    return createdFaqs;
  }
}*/
