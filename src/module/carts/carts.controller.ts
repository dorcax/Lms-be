import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CartsService } from './carts.service';
import { Auth, AuthUser } from '../auth/decorators/auth.decorator';
import { UserRole } from '@prisma/client';
import { userEntity } from '../auth/entities/auth.entity';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Auth([UserRole.STUDENT])
  @Post('/courseId/:courseId')
  async addToCart(
    @AuthUser() student: userEntity,
    @Param('courseId') courseId: string,
  ) {
    return await this.cartsService.addToCart(student, courseId);
  }

  @Auth([UserRole.STUDENT])
  @Get()
  async getCart(@AuthUser() student: userEntity) {
    return await this.cartsService.getCart(student.id);
  }


  @Auth([UserRole.STUDENT])
  @Delete('/remove/:courseId')
  async removeFromCart(
    @AuthUser() student: userEntity,
    @Param('courseId') courseId: string,
  ) {
    return await this.cartsService.removeFromCart(student, courseId);
  }
}
