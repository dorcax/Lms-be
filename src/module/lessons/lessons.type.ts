import { PartialType } from '@nestjs/mapped-types';
import { LessonType } from '@prisma/client';
import { IsArray, IsEnum, IsNumber, IsString } from 'class-validator';

export class CreateLessonDto {
  @IsString()
  title: string;

  @IsEnum(LessonType)
  contentType: LessonType;

  @IsNumber()
  position: number;

  @IsString()
  moduleId: string;

  @IsArray()
  attachmentIds: string[];
}

export class updateLessonDto  extends PartialType (CreateLessonDto){}
