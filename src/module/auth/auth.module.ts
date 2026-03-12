import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { AuthOtpTokenModule } from 'src/services/auth-otp-token/auth-otp-token.module';
import{JwtModule} from "@nestjs/jwt"
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard } from './guards/authGuard';

@Global()
@Module({
imports: [
  AuthOtpTokenModule,
  JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_ACCESS_SECRET'),
      signOptions: { expiresIn: '15m' },
    }),
  }),
],
  controllers: [AuthController],
  providers: [AuthService, PrismaService,AuthGuard],
  exports:[AuthGuard,JwtModule]
})
export class AuthModule {}
