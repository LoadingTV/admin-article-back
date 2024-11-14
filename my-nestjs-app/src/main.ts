import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  // Enable CORS with specific origins
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://admin-article-front-9mlc.vercel.app',
      'https://admin-article-front-9mlc.vercel.app',
      'https://loading.wtf',
      'https://usasprayme.com',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Enable global validation pipe
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(3001, '0.0.0.0');
}
console.log(process.env.DATABASE_URL);

bootstrap();
