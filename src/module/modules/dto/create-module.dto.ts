import { IsNumber, IsString } from 'class-validator';

export class CreateModuleDto {
  @IsString()
  courseId: string;
  @IsString()
  title: string;
  @IsNumber()
  position: number;
}
