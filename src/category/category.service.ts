import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) { }  

  async create(createCategoryDto: CreateCategoryDto, secureUrl: string) {

    try {
      createCategoryDto.CPhoto = secureUrl;

      const category = this.categoryRepository.create(createCategoryDto);
      await this.categoryRepository.save(category);

      return category;
      
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto;

    const categories = await this.categoryRepository.find({
      take: limit,
      skip: offset,
    });

    return categories;
  }

  async findOne(IdCategory: string) {

    if (!isUUID(IdCategory))
      throw new NotFoundException(`El Id de la categoria ${ IdCategory } no es un UUID valido`);

    const category = await this.categoryRepository.findOneBy({ IdCategory });

    if (!category) 
      throw new NotFoundException(`Cateogria con el Id ${ IdCategory } no existe`);

    return category;
  }

  async update(IdCategory: string, updateCategoryDto: UpdateCategoryDto) {

    if (!isUUID(IdCategory))
      throw new NotFoundException(`El Id ${ IdCategory } no es un UUID valido`);

    const category = await this.categoryRepository.preload({ IdCategory, ...updateCategoryDto });

    if ( !category )
      throw new NotFoundException(`Categoria con el id: ${ IdCategory } no existe`);

    await this.categoryRepository.save(category); 

    return category;

  }

  async remove(IdCategory: string) {
    const category = await this.findOne( IdCategory );

    await this.categoryRepository.remove(category);

    return `Categoria ${category} eliminada`;
  }

  private handleDBExceptions( error: any ) {

    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);
    
    // this.logger.error(error)
    // console.log(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');

  }
}
