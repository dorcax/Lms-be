import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ReviewService } from './review.service';
import { UserRole } from '@prisma/client';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('reviews')
export class ReviewController {

  constructor(private readonly reviewService: ReviewService) {}

  @Auth([UserRole.STUDENT])
  @Post()
  createReview(@Body() body) {
    return this.reviewService.createReview(
      body.studentId,
      body.courseId,
      body.rating,
      body.comment
    );
  }

  @Get(':courseId')
  getReviews(@Param('courseId') courseId: string) {
    return this.reviewService.getCourseReviews(courseId);
  }
}