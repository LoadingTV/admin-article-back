import { IsNotEmpty } from 'class-validator';

export class CreateFaqDto {
  @IsNotEmpty()
  question: string;

  @IsNotEmpty()
  answer: string;

  @IsNotEmpty()
  articleId: number;
}