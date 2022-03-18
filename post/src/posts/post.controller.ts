import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PostsService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Posts } from './schemas/post.schema';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    await this.postService.create(createPostDto);
  }

  @Get()
  async findAll(): Promise<Posts[]> {
    return this.postService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Posts> {
    return this.postService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<Posts> {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.postService.delete(id);
  }
}
