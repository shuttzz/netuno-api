import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { json } from 'express';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './shared/exceptions/filters/all-exception.filter';

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(json({ limit: '50mb' }));

  app.enableCors({
    origin: '*',
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
    optionsSuccessStatus: 204,
  });

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(process.env.APP_API_PORT, () =>
    console.log(
      `🚀 Server started on port ${process.env.APP_API_PORT} [${process.env.NODE_ENV}] 🚀`,
    ),
  );
}

bootstrap();
