import { Controller, Get, Param } from '@nestjs/common';
import { LearningService } from './learning.service';
import { Auth, AuthUser } from '../auth/decorators/auth.decorator';
import { UserRole } from '@prisma/client';
import { userEntity } from '../auth/entities/auth.entity';

@Controller('learning')
export class LearningController {
  constructor(private readonly learningService: LearningService) {}




  @Auth([UserRole.STUDENT])
@Get('lesson/:lessonId/video')
getLessonVideo(
  @AuthUser() user: userEntity,
  @Param('lessonId') lessonId: string,
  @Param('courseId') courseId: string
) {
  return this.learningService.getLessonVideo(user, courseId, lessonId);
}
}
