import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { userEntity } from '../auth/entities/auth.entity';
import { bad } from 'src/utils/errors';

@Injectable()
export class LearningService {
  constructor(private readonly prismaService: PrismaService) {}

  async getLessonVideo(user: userEntity, courseId: string, lessonId: string) {
    const [isStudentEnrolled, lesson] = await Promise.all([
      await this.prismaService.enrollment.findFirst({
        where: {
          studentId: user.id,
          courseId: courseId,
          status: 'ACTIVE',
        },
      }),

      await this.prismaService.lesson.findFirst({
        where: {
          id: lessonId,
          module: {
            courseId: courseId,
          },
        },
        include: {
          module: true,
          attachments: {
            select: {
              uploads: {
                select: {
                  url: true,
                },
              },
            },
          },
        },
      }),
    ]);

    if (!isStudentEnrolled) {
      throw new Error('You must purchase this course to watch this lesson');
    }

    return lesson;
  }

  //   lesson complete
  async lessonCompletion(user: userEntity, courseId: string, lessonId: string) {
    const [lesson, isStudentEnrolled, existingProgress] = await Promise.all([
      await this.prismaService.lesson.findFirst({
        where: {
          id: lessonId,
          module: {
            courseId,
          },
        },
      }),
      await this.prismaService.enrollment.findFirst({
        where: {
          studentId: user.id,
          courseId: courseId,
          status: 'ACTIVE',
        },
      }),

      await this.prismaService.progress.findFirst({
        where: {
          studentId: user.id,
          lessonId,
        },
      }),
    ]);

    if (!lesson) bad('lesson not found');

    if (!isStudentEnrolled) {
      throw new Error('You must purchase this course to complete this lesson');
    }

    if (existingProgress) bad('lesson already completed');

    // mark the lesson as complete
    return await this.prismaService.progress.create({
      data: {
        studentId: user.id,
        lessonId: lessonId,
        completed: true,
      },
    });
  }

  async getStudentProgress(user: userEntity, courseId: string) {
    const [totalLessons, completedLessons] = await Promise.all([
      await this.prismaService.lesson.count({
        where: {
          module: {
            courseId,
          },
        },
      }),
      await this.prismaService.progress.count({
        where: {
          studentId: user.id,
          completed: true,
          lesson: {
            module: {
              courseId,
            },
          },
        },
      }),
    ]);

    const percentage = (completedLessons / totalLessons) * 100;
    return {
      totalLessons,
      completedLessons,
      percentage,
    };
  }
}
