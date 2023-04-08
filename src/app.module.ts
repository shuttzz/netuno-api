import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './modules/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UploadModule } from './modules/upload/upload.module';
import { QueueModule } from './queue/queue.module';
import { CategoryModule } from './modules/category/category.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { RegisterModule } from './modules/register/register.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    DatabaseModule,
    AuthModule,
    UploadModule,
    QueueModule,
    CategoryModule,
    WalletModule,
    RegisterModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
