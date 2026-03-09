import { UserRole } from '@prisma/client';
import { IsEmail, IsEnum, IsString } from 'class-validator';

export class CreateAuthDto {
  @IsString()
  fullName: string;
  @IsEmail()
  email: string;
  @IsString()
  password: string;
    @IsEnum(UserRole)
  role: UserRole;
}

export class CreateLoginDto {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}

export class VerifyOtpDto {
  @IsEmail()
  email: string;
  @IsString()
  code: string;
}

export class ResendOtpDto {
  @IsEmail()
  email: string;
}
