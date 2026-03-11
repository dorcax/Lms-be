import { IsArray, IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class VerificationDto {
  @IsEmail()
  email: string;

  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsNumber()
  year: number;
}

export class CourseItemDto {
  @IsString()
  title: string;

  @IsString()
  price: string;
}

export class sendOrderVerificationDto {
  @IsString()
  orderId: string;
  @IsString()
  email: string;
  @IsString()
   @IsOptional()
  studentName?:string;
  @IsString()
  @IsOptional()
  instructorName?: string;
  @IsString()
  orderNumber: string;
  @IsArray()
  courses: CourseItemDto[];
  @IsNumber()
  totalAmount: number;
}
