import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { isUUID } from 'class-validator';
import { CategoryService } from '../category/category.service';
import { User } from '../auth/entities/user.entity';
import { Category } from 'src/category/entities/category.entity';

@Injectable()
export class PostService {

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly categoryService: CategoryService
  ) { }

  async create(createPostDto: CreatePostDto, secureUrl: string, User: User) {

    const { IdCategory } = createPostDto;

    const Category = await this.categoryService.findOne(IdCategory);

    try {
      createPostDto.PPhoto = secureUrl;

      const post = this.postRepository.create(
        {
          ...createPostDto,
          Category,
          User
        }
      );
      await this.postRepository.save(post);

      return post;

    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto;

    const posts = await this.postRepository.find({
      take: limit,
      skip: offset,
      relations: {
        Category: true,
        User: true
      }
    });

    return posts;
  }

  async findOne(Term: string) {

    let post: Post;
    const queryBuilder = this.postRepository.createQueryBuilder('post');

    if (isUUID(Term)) {
      post = await queryBuilder
        .where({
          IdPost: Term.toLowerCase(),
        })
        .leftJoinAndSelect('post.Category', 'CategoryPost')
        .leftJoinAndSelect('CategoryPost.Post', 'CategoryPostC')
        .leftJoinAndSelect('CategoryPostC.Category', 'CategoryPostCc')
        .leftJoinAndSelect('post.User', 'UserPost')
        .getOne();
    } else {
      post = await queryBuilder
        .where({
          PSlug: Term.toLowerCase(),
        })
        .leftJoinAndSelect('post.Category', 'CategoryPost')
        .leftJoinAndSelect('CategoryPost.Post', 'CategoryPostC')
        .leftJoinAndSelect('CategoryPostC.Category', 'CategoryPostCc')
        .leftJoinAndSelect('post.User', 'UserPost')
        .getOne();
    };

    if (!post)
      throw new NotFoundException(`Post with ${Term} not found`);

    return post;

  }

  async update(IdPost: string, updatePostDto: UpdatePostDto) {

    if (!isUUID(IdPost))
      throw new NotFoundException(`El Id ${IdPost} no es un UUID valido`);

    const { IdCategory } = updatePostDto;

    const Category = await this.categoryService.findOne(IdCategory);

    const post = await this.postRepository.preload({ IdPost, ...updatePostDto, Category });

    if (!post)
      throw new NotFoundException(`post con el id: ${IdPost} no existe`);

    await this.postRepository.save(post);

    return post;

  }

  async remove(IdPost: string) {
    const post = await this.findOne(IdPost);

    await this.postRepository.remove(post);

    return `post ${post} eliminada`;
  }

  private handleDBExceptions(error: any) {

    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    // this.logger.error(error)
    // console.log(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');

  }
}
