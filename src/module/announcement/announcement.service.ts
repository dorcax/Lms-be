import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class AnnouncementService {
  constructor(private prisma: PrismaService) {}

  async createAnnouncement(instructorId: string, courseId: string, title: string, message: string) {

    return await this.prisma.announcement.create({
      data: {
        instructorId,
        courseId,
        title,
        message
      }
    });
  }

  async getCourseAnnouncements(courseId: string) {
    return this.prisma.announcement.findMany({
      where: { courseId },
      orderBy: { createdAt: "desc" }
    });
  }
}