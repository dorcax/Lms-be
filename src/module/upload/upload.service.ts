import { Injectable, Logger } from '@nestjs/common';
import { connectId } from '../../../prisma/prisma.util';
import  { MediaService} from 'src/config/cloudinary.config';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { userEntity } from '../auth/entities/auth.entity';
import { v2 as cloudinary } from 'cloudinary';
@Injectable()
export class UploadService {
    constructor(private readonly prisma :PrismaService,private readonly mediaService: MediaService){}
  private readonly logger = new Logger(UploadService.name);
    
async uploadFile(file:Express.Multer.File,user:userEntity,type:"image"|"video",folder?:string){
    const uploadResult= await this.mediaService.uploadFile(file.buffer,type,folder)
    const data= await this.prisma.upload.create({
        data:{
           name:file.originalname,
           url:uploadResult.secure_url,
           publicId:uploadResult.public_id,
           type:file.mimetype,
           size:file.size,
           duration:Math.round(uploadResult.duration),
           user:connectId(user.id)
           
        }
    })
    this.logger.log(`File uploaded: ${data.name} by user ${user.id}`);
    return data

}

// get upload by id  

async uploadIds(ids:string[]){
    return await this.prisma.upload.findMany({
        where:{
            id:{in:ids}
        },
        include:{
            attachments:true,
            user:true
        }
    })}


// download the url 
async download(id:string){
return await this.prisma.upload.findUnique({
    where:{
        id
    },
    select:{
        url:true,name:true,type:true
    }
})
}
// delete upload from cloudinary

async deleteUpload(ids:string[],user:userEntity){
    const uploads =await this.prisma.upload.findMany({
        where:{
            id:{in:ids},
            user:{
                id:user.id
            }
        }
    }) 
    // delete from cloudinary 
    for(let upload of uploads){
        if(upload.publicId){
            await cloudinary.uploader.destroy(upload.publicId)
        }
    }


    // delete in db 
  return await this.prisma.upload.deleteMany({
        where:{
            id:{in:ids},
            user:{
                id:user.id
            }
        }
    })

}
}
