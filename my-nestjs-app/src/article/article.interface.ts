export interface ArticleResponse {
  success: boolean;
  fileName: string;
  message: string;
}

export interface ImageUploadResult {
  originalName: string;
  savedAs: string;
  path: string;
}
