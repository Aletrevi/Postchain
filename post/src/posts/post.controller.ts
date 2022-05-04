import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PostsService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Posts } from './schemas/post.schema';

import { ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { UpdatePostDto } from './dto/update-post.dto';
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';
import { combineLatest, Observable } from 'rxjs';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postService: PostsService,
    @Inject('RABBIT_TRIGGERS') private triggerSClient: ClientProxy,
    @Inject('RABBIT_EVENTS') private eventsClient: ClientProxy,
    
  ) {}

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
    let body = await this.postService.create(createPostDto);
   
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
  
  @EventPattern('post_verified')
  postaApprovedEvent(@Payload() body: any): Promise<Posts> {
    return this.postService.manageApproval(body);
  } 
  
  @EventPattern('post_rejected')
  postRejectedEvent(@Payload() body: any){
    return this.postService.manageRejection(body); 
  }

  @EventPattern('block_published')
  blockPublishedEvent(@Payload() body: any){
    return this.postService.managePublication(body);
  }

  @EventPattern('block_not_published')
  blockNotPublishedEvent(@Payload() body: any){
    return this.postService.managePublicationFailed( body); 
  }

}
