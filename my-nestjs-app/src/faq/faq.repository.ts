import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; 
import { FAQ } from '@prisma/client'; 

@Injectable()
export class FaqRepository {
  constructor(private prisma: PrismaService) {}

  async create(faqData: { question: string; answer: string; articleId: number }): Promise<FAQ> {
    return this.prisma.faq.create({
      data: {
        question: faqData.question,
        answer: faqData.answer,
        article_id: faqData.articleId, 
      },
    });
  }

  async findAll(): Promise<FAQ[]> {
    return this.prisma.faq.findMany(); 
  }

}