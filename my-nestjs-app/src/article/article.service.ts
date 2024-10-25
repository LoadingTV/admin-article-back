import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ArticleService {
  private readonly directoryPath = path.join(__dirname, '..', 'articles');

  async createFile() {
    const fileName = `article_${Date.now()}.txt`;
    const filePath = path.join(this.directoryPath, fileName);

    fs.writeFileSync(filePath, '');
    return { message: 'File created successfully', fileName };
  }

  async listFiles() {
    return fs.readdirSync(this.directoryPath);
  }
}
