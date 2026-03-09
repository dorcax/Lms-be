import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Auth, AuthUser } from '../auth/decorators/auth.decorator';
import { userEntity } from '../auth/entities/auth.entity';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { ModulesService } from './modules.service';

@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  // Create a module
  @Auth([UserRole.INSTRUCTOR])
  @Post()
  async createModule(
    @Body() dto: CreateModuleDto,
    @AuthUser() user: userEntity,
  ) {
    const module = await this.modulesService.createModule(dto, user);
    return { message: 'Module created successfully', module };
  }

  // Get all modules for a course
  @Auth([UserRole.INSTRUCTOR])
  @Get('course/:courseId')
  async getModules(@Param('courseId') courseId: string) {
    const modules = await this.modulesService.getModules(courseId);
    return modules;
  }

  // Update a module
  @Auth([UserRole.INSTRUCTOR])
  @Patch(':moduleId')
  async updateModule(
    @Param('moduleId') moduleId: string,
    @Body() dto: UpdateModuleDto,
    @AuthUser() user: userEntity,
  ) {
    const updatedModule = await this.modulesService.updateModule(
      moduleId,
      dto,
      user,
    );
    return { message: 'Module updated successfully', updatedModule };
  }

  // Delete a module
  @Auth([UserRole.INSTRUCTOR])
  @Delete(':moduleId')
  async deleteModule(
    @Param('moduleId') moduleId: string,
    @AuthUser() user: userEntity,
  ) {
    await this.modulesService.deleteModule(moduleId, user);
    return { message: 'Module deleted successfully' };
  }
}
