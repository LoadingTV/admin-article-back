import { IsString, IsOptional, IsUrl } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  title: string;

  @IsString()
  metaDescription: string;

  @IsString()
  text: string;

  @IsOptional()
  @IsUrl()
  link?: string;
}
