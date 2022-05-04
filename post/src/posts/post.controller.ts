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

import { ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { UpdatePostDto } from './dto/update-post.dto';
import { EventPattern, Payload } from '@nestjs/microservices';
import { combineLatest, Observable } from 'rxjs';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Post()
  @ApiBody({
    required: true,
    type: CreatePostDto,
  })
  @ApiResponse({
    status: 200,
    description: 'The created post',
    type: Posts,
  })
  async create(@Body() createPostDto: CreatePostDto) {
    await this.postService.create(createPostDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Retrieve all posts',
    type: [Posts],
  })
  async findAll(): Promise<Posts[]> {
    return this.postService.findAll();
  }

  @Get(':id')
  @ApiQuery({
    name: 'id',
    required: true,
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'The found post',
    type: Posts,
  })
  async findOne(@Param('id') id: string): Promise<Posts> {
    return this.postService.findOne(id);
  }

  @Put(':id')
  @ApiQuery({
    name: 'id',
    required: true,
    type: String,
  })
  @ApiBody({
    required: true,
    type: UpdatePostDto,
  })
  @ApiResponse({
    status: 200,
    description: 'The updated post',
    type: Posts,
  })
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

  // @EventPattern('post_created')
  // postCreatedEvent(@Payload() body: any): Observable<any> {
  //   let checker = this.checker_service_triggers_client.emit<any>('verify_post', body);
  //   let bc = this.bc_interactor_triggers_client.emit<any>('create_block', body);
  //   return combineLatest({ checker: checker, bc: bc});
  // }

  // @EventPattern('post_verified')
  // postVerifiedEvent(@Payload() body: any): Observable<any> {
  //   return this.post_service_triggers_client.emit<any>('post_verified', body); // TODO: modificare 
  // }

  // @EventPattern('post_rejected')
  // postRejectedEvent(@Payload() body: any): Observable<any> {
  //   return this.post_service_triggers_client.emit<any>('post_rejeceted', body); // TODO: modificare 
  // }

  // @EventPattern('block_published')
  // blockPublishedEvent(@Payload() body: any): Observable<any>{
  //   return this.bc_interactor_triggers_client.emit<any>('block_published', body); // TODO: modificare 
  // }

  // @EventPattern('block_not_published')
  // blockNotPublishedEvent(@Payload() body: any): Observable<any>{
  //   return this.bc_interactor_triggers_client.emit<any>('block_not_published', body); // TODO: modificare 
  // }
  // @EventPattern('post_reformed')
  // postReformedEvent(@Payload() body: any): Observable<any>{
  //   return this.post_service_triggers_client.emit<any>('post_reformed', body); // TODO: modificare 
  // }

}
