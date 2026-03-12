export class CreateQuizDto {
  courseId: string;
  lessonId: string;
  title: string;
}
export class SubmitQuizDto {
  studentId: string;
  quizId: string;
  answers: {
    questionId: string;
    answer: string;
  }[];
}

export class CreateQuestionDto {
  quizId: string;
  text: string;
  options: string[];
  answer: string;
}