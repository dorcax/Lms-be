import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { createCourseDto } from './courses.type';
import { userEntity } from '../auth/entities/auth.entity';
import { bad } from 'src/utils/errors';
import { connectId } from 'prisma/prisma.util';

@Injectable()
export class CoursesService {
  constructor(private readonly prismaService: PrismaService) {}

  async createCourse(dto: createCourseDto, user: userEntity) {
    const { courseUploadIds, ...rest } = dto;
    // find the user
    const userExist = await this.prismaService.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        profile: true,
      },
    });
    if (!userExist) bad('user not found ');
    if (!userExist.profile) bad('please complete your profile ');

    const course = await this.prismaService.course.create({
      data: {
        ...rest,
        courseUpload: {
          connect:courseUploadIds? courseUploadIds.map((id) => ({ id })):undefined,
        },
        instructor: connectId(user.id),
      },
    });

    return {
      message: 'coruses created in draft  successfully',
      course,
    };
  }

  async publishCourse(courseId: string, user: userEntity) {
    // find the course
    const course = await this.prismaService.course.findUnique({
      where: {
        id: courseId,
      },
    });
    if (!course) bad('course not found ');

    if (course.instructorId !== user.id)
      bad('you are not allowed to publish this course ');

    if (course.isPublished) bad('course is already published ');
    const publishCourse = await this.prismaService.course.update({
      where: {
        id: courseId,
      },
      data: {
        isPublished: true,
      },
    });

    return {
      message: 'course published successfully',
    };
  }

//   get all courses
  async getAllCourses() {
    return await this.prismaService.course.findMany({
      include: {
        instructor: true,
        courseUpload: true,
        modules: { include: { lessons: true } },
      },
    });
  }

//  get all the course by a particular instructor  
async getAllCoursesByInstructor(user:userEntity){
     return await this.prismaService.course.findMany({
        where:{
            instructorId:user.id
        },
      include: {
        instructor: true,
        courseUpload: true,
        modules: { include: { lessons: true } },
      },
    });

}

//   get single course  
   async getCourseById(courseId: string) {
    const course = await this.prismaService.course.findUnique({
      where: { id: courseId },
      include: {
        instructor: true,
        courseUpload: true,
        modules: { include: { lessons:{
          select:{
            title:true
          }
        }
        }} ,
      },
    });

    if (!course) bad('Course not found');
    return course;
  }

  async updateCourse(courseId: string, dto: createCourseDto, user: userEntity) {
    const course = await this.prismaService.course.findUnique({
      where: { id: courseId },
    });
    if (!course) bad('Course not found');
    if (course.instructorId !== user.id) bad('Not allowed to update this course');

    const { courseUploadIds, ...rest } = dto;

    const updatedCourse = await this.prismaService.course.update({
      where: { id: courseId },
      data: {
        ...rest,
        courseUpload: courseUploadIds
          ? { connect: courseUploadIds.map((id) => ({ id })) }
          : undefined,
      },
    });

    return {
      message: 'Course updated successfully',
      updatedCourse,
    };
  }

// delete course
  async deleteCourse(courseId: string, user: userEntity) {
    const course = await this.prismaService.course.findUnique({
      where: { id: courseId },
    });
    if (!course) bad('Course not found');
    if (course.instructorId !== user.id) bad('Not allowed to delete this course');

    await this.prismaService.course.delete({
      where: { id: courseId },
    });

    return { message: 'Course deleted successfully' };
  }

}
