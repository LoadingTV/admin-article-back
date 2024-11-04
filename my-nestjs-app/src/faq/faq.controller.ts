import { Controller, Post, Body, Get } from '@nestjs/common';
import { FaqRepository } from './faq.repository';
import { CreateFaqDto } from './dto/faq.dto';
import { FAQ } from '@prisma/client';

@Controller('faq')
export class FaqController {
  constructor(private readonly faqRepository: FaqRepository) {}

  @Post()
  async create(@Body() createFaqDto: CreateFaqDto): Promise<FAQ> {
    return this.faqRepository.create(createFaqDto);
  }

  @Get()
  async findAll(): Promise<FAQ[]> {
    return this.faqRepository.findAll();
  }
}
