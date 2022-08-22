import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { diskStorage } from 'multer';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from '../common/helpers/fileFilter.helper';
import { fileNamer } from '../common/helpers/fileNamer.helper';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from '../auth/entities/user.entity';

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly configService: ConfigService) { }

  @Post()
  @Auth()
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    // limits: { fileSize: 1000 }
    storage: diskStorage({
      destination: './static/post',
      filename: fileNamer
    })
  }))
  create(
    @Body() createPostDto: CreatePostDto,
    @GetUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Make sure that the file is an image');
    }
    const secureUrl = `${this.configService.get('HOST_API')}/files/post/${file.filename}`;

    return this.postService.create(createPostDto, secureUrl, user);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.postService.findAll(paginationDto);
  }

  @Get(':Term')
  findOne(@Param('Term') Term: string) {
    return this.postService.findOne(Term);
  }

  @Patch(':IdPost')
  update(@Param('IdPost') IdPost: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(IdPost, updatePostDto);
  }

  @Delete(':IdPost')
  remove(@Param('IdPost') IdPost: string) {
    return this.postService.remove(IdPost);
  }
}
