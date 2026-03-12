import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { bad } from 'src/utils/errors';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async createReview(studentId: string, courseId: string, rating: number, comment: string) {

    const enrollment = await this.prisma.enrollment.findFirst({
      where: { studentId, courseId, status: "ACTIVE" }
    });

    if (!enrollment) bad("You must purchase this course to review");

    const existingReview = await this.prisma.review.findFirst({
      where: { studentId, courseId }
    });

    if (existingReview) bad("Review already exists");

    return this.prisma.review.create({
      data: {
        studentId,
        courseId,
        rating,
        comment
      }
    });
  }

  async getCourseReviews(courseId: string) {
    return this.prisma.review.findMany({
      where: { courseId },
      include: {
        student: {
          select: {
            fullName: true
          }
        }
      }
    });
  }
}