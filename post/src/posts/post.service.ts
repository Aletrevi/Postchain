import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Posts, PostsDocument } from './schemas/post.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Posts.name) private readonly postModel: Model<PostsDocument>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Posts> {
    const createdPost = await this.postModel.create(createPostDto);
    return createdPost;
  }

  async findAll(): Promise<Posts[]> {
    return this.postModel.find().exec();
  }

  async findOne(id: string): Promise<Posts> {
    return this.postModel.findOne({ _id: id }).exec();
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Posts> {
    const updatedPost = await this.postModel
      .findByIdAndUpdate(id, updatePostDto)
      .exec();
    return updatedPost;
  }

  async delete(id: string) {
    const deletedCat = await this.postModel
      .findByIdAndRemove({ _id: id })
      .exec();
    return deletedCat;
  }
}
