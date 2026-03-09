import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { userEntity } from '../auth/entities/auth.entity';
import { CoursesService } from './courses.service';
import { createCourseDto } from './courses.type';
import { Auth, AuthUser } from '../auth/decorators/auth.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  
  @Auth([UserRole.INSTRUCTOR])
  @Post()
  async createCourse(@Body() dto: createCourseDto, @Req() req,@AuthUser() user:userEntity) {

    return await this.coursesService.createCourse(dto, user);
  }

 
  @Get()
  async getAllCourses() {
    return await this.coursesService.getAllCourses();
  }

 
  @Auth([UserRole.INSTRUCTOR])
  @Get('my-courses')
  async getAllCoursesByInstructor(@Req() req,@AuthUser() user:userEntity) {
    return await this.coursesService.getAllCoursesByInstructor(user);
  }

 @Auth()
  @Get(':id')
  async getCourseById(@Param('id') courseId: string) {
    return await this.coursesService.getCourseById(courseId);
  }


  @Auth([UserRole.INSTRUCTOR])
  @Patch(':id')
  async updateCourse(
    @Param('id') courseId: string,
    @Body() dto: createCourseDto,
    @Req() req,
    @AuthUser() user:userEntity
  ) {

    return await this.coursesService.updateCourse(courseId, dto, user);
  }
  
  // Publish a course
  @Auth([UserRole.INSTRUCTOR])
  @Patch(':id/publish')
  async publishCourse(@Param('id') courseId: string, @Req() req,@AuthUser() user:userEntity) {
    
    return await this.coursesService.publishCourse(courseId, user);
  }


  // Delete a course
  @Auth([UserRole.INSTRUCTOR])
  @Delete(':id')
  async deleteCourse(@Param('id') courseId: string, @Req() req,@AuthUser() user:userEntity) {
   
    return await this.coursesService.deleteCourse(courseId, user);
  }
}