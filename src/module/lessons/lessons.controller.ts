import { Controller, Post, Get, Put, Delete, Body, Param, Req } from '@nestjs/common';
import { LessonsService } from './lessons.service';

import { userEntity } from '../auth/entities/auth.entity';
import { Auth, AuthUser } from '../auth/decorators/auth.decorator';
import { UserRole } from '@prisma/client';
import { CreateLessonDto, updateLessonDto } from './lessons.type';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonService: LessonsService) {}

  @Auth([UserRole.INSTRUCTOR])
  @Post()
  createLesson(@Body() dto: CreateLessonDto, @Req() req,@AuthUser() user:userEntity) {
    
    return this.lessonService.createLesson(dto);
  }


  @Auth([UserRole.INSTRUCTOR])
  @Get('module/:moduleId')
  getLessons(@Param('moduleId') moduleId: string) {
    return this.lessonService.getLessons(moduleId);
  }

  @Auth([UserRole.INSTRUCTOR])
  @Get(':lessonId')
  getLesson(@Param('lessonId') lessonId: string) {
    return this.lessonService.getLessonById(lessonId);
  }


  @Auth([UserRole.INSTRUCTOR])
  @Put(':lessonId')
  updateLesson(@Param('lessonId') lessonId: string, @Body() dto: updateLessonDto, @Req() req,@AuthUser() user:userEntity) {
  
    return this.lessonService.updateLesson(lessonId, dto);
  }


@Auth([UserRole.INSTRUCTOR])
  @Delete(':lessonId')
  deleteLesson(@Param('lessonId') lessonId: string, @Req() req,@AuthUser() user:userEntity) {
    return this.lessonService.deleteLesson(lessonId, user);
  }
}