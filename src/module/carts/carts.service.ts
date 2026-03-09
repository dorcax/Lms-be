import { Injectable } from '@nestjs/common';
import { connectId } from 'prisma/prisma.util';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { bad } from 'src/utils/errors';
import { userEntity } from '../auth/entities/auth.entity';

@Injectable()
export class CartsService {
  constructor(private readonly prismaService: PrismaService) {}
  async createCart(studentId: string) {
    // check if the student exist
    const student = await this.prismaService.user.findUnique({
      where: { id: studentId },
    });
    if (!student) bad('student not found ');
    // check for existing cart
    const existingCart = await this.prismaService.cart.findUnique({
      where: { studentId },
    });
    if (existingCart) bad('cart already exists');
    // create cart
    const cart = await this.prismaService.cart.create({
      data: {
        student: {
          connect: { id: studentId },
        },
      },
    });

    return cart;
  }

  async addToCart(student: userEntity, courseId: string) {
    // check if the student exist

    const existingStudent = await this.prismaService.user.findUnique({
      where: { id: student.id },
    });
    if (!existingStudent) bad('student not found ');

    const course = await this.prismaService.course.findUnique({
      where: { id: courseId },
    });
    if (!course) bad('course  not found ');
    if (!course.isPublished) bad('course is not yet published');
    
     // check if user is enrolled
    const isEnrolled = await this.prismaService.enrollment.findFirst({
      where: {
        studentId: existingStudent.id,
        courseId,
      },
    });
    if (isEnrolled) bad('you have already enrolled for this course ');
    // check for existing cart
    let  cart  = await this.prismaService.cart.findUnique({
      where: { studentId : existingStudent.id },
    });
    

    if (!cart) {
      await this.createCart(existingStudent.id);
    }
   
    // check if item is added to cart before
    const existingCartItem = await this.prismaService.cartItem.findFirst({
      where: {
        cartId: cart!.id,
        courseId,
      },
    });
    // create cartitems
    const cartItems = await this.prismaService.cartItem.create({
      data: {
        cart: connectId(cart!.id),
        course: connectId(courseId),
      },
    });

    return cartItems;
  }

  async getCart(studentId:string){
    return await this.prismaService.cart.findUnique({
        where:{
            studentId
        },
        include:{
            items:true
        }
    })
  }

  async removeFromCart(student: userEntity, courseId: string) {

    // check for existing cart
    const cart = await this.prismaService.cart.findUnique({
      where: { studentId: student.id },
    });
    if (!cart) bad('cart not found');

    // check if item is in cart
    const existingCartItem = await this.prismaService.cartItem.findFirst({
      where: {
        cartId: cart!.id,
        courseId,
      },
    });
    if (!existingCartItem) bad('item not found in cart');

    // remove item from cart
    await this.prismaService.cartItem.delete({
      where: {
        id: existingCartItem.id,
      },
    });
  }
}
