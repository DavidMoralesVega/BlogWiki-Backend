import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  findAll( @Query() paginationDto: PaginationDto) {
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
