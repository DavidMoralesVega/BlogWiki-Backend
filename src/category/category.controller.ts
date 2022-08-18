import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter } from '../common/helpers/fileFilter.helper';
import { fileNamer } from '../common/helpers/fileNamer.helper';
import { ConfigService } from '@nestjs/config';

@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly configService: ConfigService,
    ) { }

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    // limits: { fileSize: 1000 }
    storage: diskStorage({
      destination: './static/category',
      filename: fileNamer
    })
  }))
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {

    if ( !file ) {
      throw new BadRequestException('Make sure that the file is an image');
    } 

    const secureUrl = `${ this.configService.get('HOST_API') }/files/category/${ file.filename }`;
    return this.categoryService.create(createCategoryDto, secureUrl);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.categoryService.findAll(paginationDto);
  }

  @Get(':IdCategory')
  findOne(@Param('IdCategory') IdCategory: string) {
    return this.categoryService.findOne(IdCategory);
  }

  @Patch(':IdCategory')
  update(@Param('IdCategory') IdCategory: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(IdCategory, updateCategoryDto);
  }

  @Delete(':IdCategory')
  remove(@Param('IdCategory') IdCategory: string) {
    return this.categoryService.remove(IdCategory);
  }
}
