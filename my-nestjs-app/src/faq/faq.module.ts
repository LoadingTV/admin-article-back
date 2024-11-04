import { Module } from '@nestjs/common';
import { FaqRepository } from './faq.repository';
import { PrismaModule } from '../../prisma/prisma.module';
import { FaqController } from './faq.controller';

@Module({
  imports: [PrismaModule],
  providers: [FaqRepository],
  exports: [FaqRepository],
  controllers: [FaqController],
})
export class FaqModule {}
