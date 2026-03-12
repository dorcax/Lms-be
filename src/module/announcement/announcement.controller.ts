import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { UserRole } from '@prisma/client';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('announcements')
export class AnnouncementController {

  constructor(private readonly service: AnnouncementService) {}

  @Auth([UserRole.INSTRUCTOR])
  @Post()
  createAnnouncement(@Body() body) {
    return this.service.createAnnouncement(
      body.instructorId,
      body.courseId,
      body.title,
      body.message
    );
  }

  @Get(':courseId')
  getAnnouncements(@Param('courseId') courseId: string) {
    return this.service.getCourseAnnouncements(courseId);
  }
}