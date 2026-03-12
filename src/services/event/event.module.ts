import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { MailModule } from '../mail/mail.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports:[EventEmitterModule.forRoot(),MailModule],
  controllers: [EventController],
  providers: [EventService,PrismaService],
})
export class EventModule {}
