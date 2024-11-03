import { Module } from '@nestjs/common';
import { FaqRepository } from './faq.repository'; // Импортируйте ваш репозиторий

@Module({
  providers: [FaqRepository],
  exports: [FaqRepository], // Экспортируйте FaqRepository, чтобы другие модули могли его использовать
})
export class FaqModule {}