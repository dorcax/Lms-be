
import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { EnrollmentModule } from '../enrollment/enrollment.module';

@Module({
  imports:[EnrollmentModule],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
