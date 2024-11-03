import { BadRequestException } from '@nestjs/common';
import { Express } from 'express';

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const validateImageFile = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    return callback(
      new BadRequestException(
        `Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`,
      ),
      false,
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return callback(
      new BadRequestException(
        `File size exceeds limit of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      ),
      false,
    );
  }

  callback(null, true);
};
