import {
  IsString,
  IsOptional,
  IsInt,
  IsArray,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class FaqDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsOptional()
  answer?: string;
}

export class CreateArticleDto {
  @IsInt()
  @IsOptional()
  article_id?: number;
  
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  keyPoints: string;

  @IsString()
  @IsOptional()
  slug: string;

  @IsString()
  @IsOptional()
  meta_description?: string;

  @IsString()
  @IsOptional()
  content: string;

  @IsInt()
  @IsOptional()
  author_id?: number;

  @IsInt()
  @IsOptional()
  status_id?: number;

  @IsString()
  @IsOptional()
  image?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FaqDto)
  @IsOptional()
  faqs?: FaqDto[];
}
