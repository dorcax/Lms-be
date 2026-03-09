import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class MediaService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadFile(
    fileBuffer: Buffer,
    type: 'image' | 'video' = 'image',
    folder?: string,
  ) {
    return new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: type,
          folder: folder || 'uploads',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      // Convert buffer to readable stream and pipe to Cloudinary
      Readable.from(fileBuffer).pipe(uploadStream);
    });
  }
}