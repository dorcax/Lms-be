import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { CreateLessonDto, updateLessonDto } from './lessons.type';
import { bad } from 'src/utils/errors';
import { connectId, createAttachments } from 'prisma/prisma.util';
import { userEntity } from '../auth/entities/auth.entity';

@Injectable()
export class LessonsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createLesson(dto: CreateLessonDto) {
    const { attachmentIds, moduleId, ...rest } = dto;
    const module = await this.prismaService.courseModule.findUnique({
      where: {
        id: moduleId,
      },
      include: { course: true },
    });

    if (!module) bad('module not found ');
    // find uploads
    const uploads = await this.prismaService.upload.findMany({
      where: {
        id: {
          in: attachmentIds,
        },
      },
    });
    const totalDuration = uploads
      .filter((upload) => upload.type.startsWith('video/'))
      .reduce((acc, upload) => acc + (upload.duration || 0), 0);
    return this.prismaService.lesson.create({
      data: {
        ...rest,
        module: connectId(moduleId),
        attachments: createAttachments(attachmentIds),
        duration: totalDuration,
      },
    });
  }
  // Get all lessons in a module
  async getLessons(moduleId: string) {
    return this.prismaService.lesson.findMany({
      where: { moduleId },
      include: { attachments: true },
    });
  }

  // Get single lesson
  async getLessonById(lessonId: string) {
    const lesson = await this.prismaService.lesson.findUnique({
      where: { id: lessonId },
      include: { attachments: true, module: true },
    });
    if (!lesson) bad('Lesson not found');
    return lesson;
  }

  async updateLesson(lessonId: string, dto: updateLessonDto) {
     const { attachmentIds,moduleId, ...rest } = dto;
    // find if lesson exist
    const lesson = await this.prismaService.lesson.findUnique({
      where: { id: lessonId },
      include: { attachments: true, module: true },
    });
    if (!lesson) bad('Lesson not found');
   
    const uploads = await this.prismaService.upload.findMany({
      where: {
        id: {
          in: attachmentIds,
        },
      },
    });
    if (!uploads.length) bad('no valid attachment found ');
    const totalDuration = uploads
      .filter((upload) => upload.type.startsWith('video/'))
      .reduce((acc, upload) => acc + (upload.duration || 0), 0);

    return this.prismaService.lesson.update({
      where: { id: lessonId },
      data: {
        ...rest,
        module: connectId(lesson.module.id),
        attachments: {
            update:{
                uploads:{
                   set: attachmentIds?.map((id) => ({ id })),
                }
            }
        },
        duration: totalDuration,
      },
    });
  }
  
   async deleteLesson(lessonId: string, user: userEntity) {
    const lesson = await this.prismaService.lesson.findUnique({
      where: { id: lessonId },
      include: { module: { include: { course: true } } },
    });
    if (!lesson) bad('Lesson not found');
    if (lesson.module.course.instructorId !== user.id)
      bad('Not allowed to delete lesson');

    return this.prismaService.lesson.delete({ where: { id: lessonId } });
  }
}
