import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FAQ } from '@prisma/client';

@Injectable()
export class FaqRepository {
  save(
    faqEntities: {
      question: string;
      answer: string;
      article: import('../article/article.entity').Article;
    }[],
  ) {
    throw new Error('Method not implemented.');
  }
  constructor(private prisma: PrismaService) {}

  async create(faqData: {
    question: string;
    answer: string;
    articleId: number;
  }): Promise<FAQ> {
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
}
