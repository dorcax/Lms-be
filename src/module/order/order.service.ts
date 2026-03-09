import { Injectable } from '@nestjs/common';
import { connectId } from 'prisma/prisma.util';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { bad } from 'src/utils/errors';
import { v4 } from 'uuid';

@Injectable()
export class OrderService {
  constructor(private readonly prismaService: PrismaService) {}

  async orderCheckOut(cartId: string, billingAddress: string) {
    // find if the cart exist
    const cart = await this.prismaService.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          select: {
            course: true,
          },
        },
        student: true,
      },
    });
    if (!cart || cart?.items.length === 0) bad('cart not found');

    await this.prismaService.$transaction(async (tx) => {
      const totalAmount = cart.items.reduce(
        (total, item) => total + item.course.price,
        0,
      );

      // create order
      const order = await tx.order.create({
        data: {
          orderNumber: `ORD -${v4()}`,
          student: connectId(cart.studentId),
          amount: totalAmount,
          billingAddress,
        },
      });

      // create order items
      const orderItems = await tx.orderItem.createMany({
        data: cart.items.map((item) => ({
          courseTitle: item.course.title,
          price: item.course.price,
          orderId: order.id,
          courseId: item.course.id,
        })),
      });

      // clear cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

    //   initiate payment  
      return order;
    });
  }


//   get all orders
async getAllOrders() {
  return this.prismaService.order.findMany({
    include: {
      student: true,
      orderItems: true,
    },
  });
}
}
