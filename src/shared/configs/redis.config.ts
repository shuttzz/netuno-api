import { QueueOptions } from 'bull';

export const redisConfig: QueueOptions = {
  redis: {
    host: process.env.REDIS_HOST,
    port: +process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  },
};
