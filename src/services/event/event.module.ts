import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports:[EventEmitterModule.forRoot(),MailModule],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
