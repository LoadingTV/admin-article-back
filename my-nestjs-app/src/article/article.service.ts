import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ArticleService {
  private readonly directoryPath = path.join(__dirname, '..', 'articles');

  async createFile(suffix: string = '') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `article_${timestamp}_${suffix}.txt`;
    const filePath = path.join(this.directoryPath, fileName);

    fs.writeFileSync(filePath, '');
    return { message: 'File created successfully', fileName };
  }

  async listFiles() {
    return fs.readdirSync(this.directoryPath);
  }
}
