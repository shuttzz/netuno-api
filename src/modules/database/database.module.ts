import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';

@Module({
  imports: [],
  providers: [...databaseProviders],
  exports: [],
})
export class DatabaseModule {}
