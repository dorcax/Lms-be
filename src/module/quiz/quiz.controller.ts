import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuestionDto, CreateQuizDto, SubmitQuizDto } from './quiz.type';
import { UserRole } from '@prisma/client';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Auth([UserRole.INSTRUCTOR])
  @Post()
  createQuiz(@Body() body: CreateQuizDto) {
    return this.quizService.createQuiz(
      body.courseId,
      body.lessonId,
      body.title,
    );
  }

  @Auth([UserRole.INSTRUCTOR])
  @Post('question')
  addQuestion(@Body() body: CreateQuestionDto) {
    return this.quizService.addQuestion(
      body.quizId,
      body.text,
      body.options,
      body.answer,
    );
  }

  @Auth()
  @Get(':quizId')
  getQuiz(@Param('quizId') quizId: string) {
    return this.quizService.getQuiz(quizId);
  }

  @Auth([UserRole.STUDENT])
  @Post('submit')
  submitQuiz(@Body() body: SubmitQuizDto) {
    return this.quizService.submitQuiz(
      body.studentId,
      body.quizId,
      body.answers,
    );
  }

  @Get('attempts/:quizId/:studentId')
  getAttempts(
    @Param('quizId') quizId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.quizService.getAttempts(studentId, quizId);
  }
}
