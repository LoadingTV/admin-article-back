import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FAQ } from '@prisma/client';
import { CreateFaqDto } from './dto/faq.dto';

@Injectable()
export class FaqRepository {
  constructor(private prisma: PrismaService) {}

  async create(faqData: CreateFaqDto): Promise<FAQ> {
    return this.prisma.fAQ.create({
      data: {
        question: faqData.question,
        answer: faqData.answer,
        article_id: faqData.articleId,
      },
    });
  }

  async findAll(): Promise<FAQ[]> {
    return this.prisma.fAQ.findMany();
  }

  async save(
    faqEntities: {
      question: string;
      answer: string;
      articleId: number;
    }[],
  ): Promise<FAQ[]> {
    const createdFaqs = await Promise.all(
      faqEntities.map((faq) =>
        this.create({
          question: faq.question,
          answer: faq.answer,
          articleId: faq.articleId,
        }),
      ),
    );
    return createdFaqs;
  }
}
