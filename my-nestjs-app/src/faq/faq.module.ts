import { Module } from '@nestjs/common';
import { FaqRepository } from './faq.repository';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [FaqRepository],
  exports: [FaqRepository],
})
export class FaqModule {}
