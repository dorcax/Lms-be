import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MailService } from '../mail/mail.service';
import { OtpEmail } from '../mail/template/verify-email';
import { sendOrderEmailVerification, Verification_Mail } from './event.type';
import { PrismaService } from '../prisma/prisma.service';
import { bad } from 'src/utils/errors';
import { StudentOrderEmail } from '../mail/template/StudentOrderEmail';
import { InstructorNotificationEmail } from '../mail/template/InstructionNotificationEmail';
// import { OtpEmail } from '../mail/templates/verify-email';

@Injectable()
export class EventService {
  constructor(
    private readonly mailService: MailService,
    private readonly prismaService: PrismaService,
  ) {}
  @OnEvent('verification_mail', { async: true })
  async SendUserVerificationMail(payload: Verification_Mail) {
    await this.mailService.sendMail(
      payload.email,
      'verify your email',
      OtpEmail,
      {
       
        name: payload.name,
        code: payload.code,
        year: new Date().getFullYear(),
      },
    );
  }

  @OnEvent('payment.success')
  async handlePaymentSuccess(event: sendOrderEmailVerification) {
    // find order with student + instructors
    const order = await this.prismaService.order.findUnique({
      where: { id: event.orderId },
      include: {
        student: true,
        orderItems: {
          include: {
            course: {
              include: {
                instructor: true,
              },
            },
          },
        },
      },
    });

    if (!order) bad('order not found ');

    // send email to student

    await this.mailService.sendOrderToStudentMail(
      order.student.email,
      'Order Confirmation',
      StudentOrderEmail,
      {
        studentName: order.student.fullName,
        orderNumber: order.orderNumber,
        totalAmount: order.amount,
        courses: order.orderItems.map((item) => ({
          title: item.courseTitle,
          price: item.price,
        })),
      },
    );

    // get instructors
    const instructors = order.orderItems.map(
      (item) => item.course.instructor,
    );
 
    await Promise.all(instructors.map((item)=>
   this.mailService.sendOrderNotificationMailToInstructor(item.email,"course purchase notification",InstructorNotificationEmail,{
     instructorName: item.fullName,
      studentName: order.student.fullName,
        orderNumber: order.orderNumber,
        courses: order.orderItems.map((item) => ({
          title: item.courseTitle,
          price: item.price,
        })),
   })
    ))
  }
}
