import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';

import { userEntity } from '../auth/entities/auth.entity';
import { bad } from 'src/utils/errors';
import { UpdateModuleDto } from './dto/update-module.dto';
import { CreateModuleDto } from './dto/create-module.dto';
import { connectId } from 'prisma/prisma.util';

@Injectable()
export class ModulesService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a module for a course
  async createModule(dto: CreateModuleDto, user: userEntity) {
    const { courseId, ...rest } = dto;
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) bad('Course not found');
    if (course.instructorId !== user.id) bad('Not allowed to add module');

    const module = await this.prisma.courseModule.create({
      data: {
        ...rest,

        course: connectId(courseId),
      },
    });
    return module;
  }

  async getModules(courseId: string) {
    return this.prisma.courseModule.findMany({
      where: { courseId },
      include: { lessons: true },
    });
  }

  async updateModule(moduleId: string, dto: UpdateModuleDto, user: userEntity) {
    const module = await this.prisma.courseModule.findUnique({
      where: { id: moduleId },
    });
    if (!module) bad('Module not found');

    const course = await this.prisma.course.findUnique({
      where: { id: module.courseId },
    });
    if (!course) bad('course not found ');
    if (course.instructorId !== user.id) bad('Not allowed to update module');

    return this.prisma.courseModule.update({
      where: { id: moduleId },
      data: { ...dto },
    });
  }

  async deleteModule(moduleId: string, user: userEntity) {
    const module = await this.prisma.courseModule.findUnique({
      where: { id: moduleId },
    });
    if (!module) bad('Module not found');

    const course = await this.prisma.course.findUnique({
      where: { id: module.courseId },
    });
    if (!course) bad('course not found ');
    if (course.instructorId !== user.id) bad('Not allowed to delete module');

    return await this.prisma.courseModule.delete({ where: { id: moduleId } });
  }
}
