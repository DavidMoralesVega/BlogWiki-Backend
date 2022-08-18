import { Controller, Get, Post, Param, UploadedFile, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';

import { Response } from 'express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';

import { fileFilter, fileNamer } from './helpers';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Get('category/:imageName')
  findCategoryImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {

    const path = this.filesService.getStaticCategoryImage( imageName ); 

    res.sendFile( path );
  }

  @Get('post/:imageName')
  findPostImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {

    const path = this.filesService.getStaticPostImage( imageName ); 

    res.sendFile( path );
  }


}
