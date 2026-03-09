import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { userEntity } from '../auth/entities/auth.entity';
import {Auth, AuthUser } from '../auth/decorators/auth.decorator';
import { bad } from '../../utils/errors';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Auth()
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    // @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @AuthUser() user: userEntity,
        @Body('type') type: 'image' | 'video',
    @Body('folder') folder?: string,
 
  ) {

    return await this.uploadService.uploadFile(file, user,type,folder);
  }

  @Post('bulk')
  async uploadIds(@Body('ids') ids: string[]) {
    return await this.uploadService.uploadIds(ids);
  }

  @Get(':id')
  async downloadUpload(@Param('id') id: string) {
    return await this.uploadService.download(id);
  }

  @Delete()
  async cleanUp(
    @Body('ids') ids: string | string[],
    @AuthUser() user: userEntity,
  ) {
    if (typeof ids === 'string') {
      // (/,\s*/g)
      ids.split(/,\s*/g);
    }
    if (!Array.isArray(ids)) bad('not an array');
 

    return await this.uploadService.deleteUpload(ids, user);
  }
}
