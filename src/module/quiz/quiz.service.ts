import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { bad } from 'src/utils/errors';

@Injectable()
export class QuizService {
  constructor(private readonly prisma: PrismaService) {}

  // create quiz (instructor)
  async createQuiz(courseId: string, lessonId: string, title: string) {
    const lesson = await this.prisma.lesson.findFirst({
      where: { id: lessonId, module: { courseId } },
    });

    if (!lesson) bad('Lesson not found');

    return this.prisma.quiz.create({
      data: {
        title,
        lessonId,
        courseId,
      },
    });
  }

  // add question
  async addQuestion(quizId: string, text: string, options: any, answer: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
    });

    if (!quiz) bad('Quiz not found');

    return this.prisma.question.create({
      data: {
        quizId,
        text,
        options,
        type: "QUIZ",
        answer,
      },
    });
  }

  // get quiz with questions (student)
  async getQuiz(quizId: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          select: {
            id: true,
            text: true,
            options: true,
          },
        },
      },
    });

    if (!quiz) bad('Quiz not found');

    return quiz;
  }

  // submit quiz attempt
  async submitQuiz(studentId: string, quizId: string, answers: any[]) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true },
    });

    if (!quiz) bad('Quiz not found');

    let correct = 0;

    quiz.questions.forEach((question) => {
      const studentAnswer = answers.find(
        (a) => a.questionId === question.id,
      );

      if (studentAnswer?.answer === question.answer) {
        correct++;
      }
    });

    const score = (correct / quiz.questions.length) * 100;

    const attempt = await this.prisma.quizAttempt.create({
      data: {
        quizId,
        studentId,
        score,
      },
    });

    return {
      score,
      correct,
      total: quiz.questions.length,
      attempt,
    };
  }

  // get attempts
  async getAttempts(studentId: string, quizId: string) {
    return this.prisma.quizAttempt.findMany({
      where: { studentId, quizId },
    });
  }
}