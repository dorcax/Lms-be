import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { bad } from 'src/utils/errors';
import { CreateEnrollmentDto } from './enrollment.type';
import { connectId } from 'prisma/prisma.util';

@Injectable()
export class EnrollmentService {
    constructor(private readonly prismaService:PrismaService){}
    
    async  createEnrollment(courseId:string,studentId:string){
        // check if the student have enroll for this course before 
        const isEnrolled =await this.prismaService.enrollment.findFirst({
            where:{
                studentId,
                courseId
            }
        })
        if(isEnrolled) bad("you have already  enrolled in this course")
        // find if the student exist  
        const student =await this.prismaService.user.findUnique({
            where:{
                id:studentId
            }
        })
        if(!student) bad("student not found")

          const course =await this.prismaService.course.findUnique({
            where:{
                id:courseId
            }
        })
          if(!course) bad("course not found ")
        
        const enrollment =await this.prismaService.enrollment.create({
            data:{
            progress:0,
            course:connectId(courseId),
            student:connectId(studentId)

            }
        })
        return enrollment
        
    }
}
