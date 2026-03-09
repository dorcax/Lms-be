import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './module/auth/auth.module';
import { UsersModule } from './module/users/users.module';
import { CoursesModule } from './module/courses/courses.module';
import { EnrollmentModule } from './module/enrollment/enrollment.module';
import { PaymentModule } from './module/payment/payment.module';
import { AnalyticsModule } from './module/analytics/analytics.module';
import { PrismaModule } from './services/prisma/prisma.module';
import { EventModule } from './services/event/event.module';
import { MailModule } from './services/mail/mail.module';
import { AuthOtpTokenModule } from './services/auth-otp-token/auth-otp-token.module';
import { ConfigModule } from '@nestjs/config';
import { UploadModule } from './module/upload/upload.module';
import { ModulesModule } from './module/modules/modules.module';
import { LessonsModule } from './module/lessons/lessons.module';
import { FlutterwaveModule } from './services/flutterwave/flutterwave.module';
import { CartsModule } from './module/carts/carts.module';
import { OrderModule } from './module/order/order.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    CoursesModule,
    EnrollmentModule,
    PaymentModule,
    AnalyticsModule,
    PrismaModule,
    EventModule,
    MailModule,
    AuthOtpTokenModule,
    UploadModule,
    ModulesModule,
    LessonsModule,
    FlutterwaveModule,
    CartsModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
