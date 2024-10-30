import { Article } from './article.entity';
export interface ArticleResponse {
  success: boolean;
  fileName?: string;
  message?: string;
  article?: Article;
}

export interface ImageUploadResult {
  originalName: string;
  savedAs: string;
  path: string;
}
