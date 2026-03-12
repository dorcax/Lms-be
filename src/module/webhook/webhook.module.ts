
import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { EnrollmentModule } from '../enrollment/enrollment.module';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Module({
  imports:[EnrollmentModule],
  controllers: [WebhookController],
  providers: [WebhookService,PrismaService],
})
export class WebhookModule {}
