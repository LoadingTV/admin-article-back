import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UploadImageDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsOptional()
  caption?: string;

  @IsString()
  @IsOptional()
  alt_text?: string;
}
