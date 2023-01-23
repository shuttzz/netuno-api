import { Module } from '@nestjs/common';
import { UploadService } from './services/upload.service';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [],
  providers: [PrismaService, UploadService],
})
export class UploadModule {}
