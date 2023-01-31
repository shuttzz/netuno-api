import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { json } from 'express';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './shared/exceptions/filters/all-exception.filter';
import * as expressBasicAuth from 'express-basic-auth';
import {
  BullAdapter,
  createBullBoard,
  ExpressAdapter as BullExpressAdapter,
} from '@bull-board/express';
import * as Queue from 'bull';
import { appQueuekey } from './shared/constants/keys.constants';
import { redisConfig } from './shared/configs/redis.config';

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const serverAdapter = new BullExpressAdapter();

  createBullBoard({
    queues: [new BullAdapter(Queue(appQueuekey, redisConfig))],
    serverAdapter: serverAdapter,
  });

  serverAdapter.setBasePath('/management/queues');

  app.use(
    '/management/queues',
    expressBasicAuth({
      users: {
        ['netuno']: 'netuno',
      },
      challenge: true,
    }),
    serverAdapter.getRouter(),
  );

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
