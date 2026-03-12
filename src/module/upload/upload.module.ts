import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { MediaService } from 'src/config/cloudinary.config';

@Module({
  controllers: [UploadController],
  providers: [UploadService, PrismaService, MediaService],
})
export class UploadModule {}
