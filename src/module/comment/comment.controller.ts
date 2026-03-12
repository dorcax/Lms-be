import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CommentService } from './comment.service';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('comments')
export class CommentController {

  constructor(private readonly service: CommentService) {}
   @Auth()
  @Post()
  createComment(@Body() body) {
    return this.service.createComment(
      body.userId,
      body.lessonId,
      body.message
    );
  }

    @Auth()
  @Post('reply')
  replyComment(@Body() body) {
    return this.service.replyComment(
      body.userId,
      body.parentId,
      body.message
    );
  }

    @Auth()
  @Get(':lessonId')
  getComments(@Param('lessonId') lessonId: string) {
    return this.service.getLessonComments(lessonId);
  }
}