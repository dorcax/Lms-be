import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class CommentService {

  constructor(private prisma: PrismaService) {}

  async createComment(studentId: string, lessonId: string, content: string) {
    return this.prisma.comment.create({
      data: {
        studentId,
        lessonId,
        content
      }
    });
  }

  async replyComment(studentId: string, lessonId: string, content: string) {
    return this.prisma.comment.create({
      data: {
        studentId,
        lessonId,
       
        content
      }
    });
  }

  async getLessonComments(lessonId: string) {
    return this.prisma.comment.findMany({
      where: {
        lessonId,
     
      },
    
    });
  }
}