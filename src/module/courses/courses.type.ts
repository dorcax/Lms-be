import { PartialType } from '@nestjs/mapped-types';
import { Difficulty } from '@prisma/client';
import { IsArray, IsEnum, IsNumber, IsString } from 'class-validator';

export class createCourseDto {
  @IsString()
  title: string;
  @IsString()
  description: string;
  @IsNumber()
  price: number;
  @IsString()
  category: string;
  @IsEnum(Difficulty)
  difficulty: Difficulty;
  @IsArray()
  courseUploadIds: string[];
}

export class UpdateCourseDto extends PartialType(createCourseDto) {}