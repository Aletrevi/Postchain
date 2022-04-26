import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { from, Observable, switchMap } from 'rxjs';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Posts, PostsDocument } from './schemas/post.schema';

@Injectable()
export class PostsService {
  constructor(
    @Inject('RABBIT_EVENTS') private eventsClient: ClientProxy,
    @InjectModel(Posts.name) private readonly postModel: Model<PostsDocument>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Posts> {
    
    return from(this.postModel.create(createPostDto)).pipe(
      switchMap((post: Posts) => {
        return this.eventsClient.emit<Posts>('post_created', post);
      })
    ).toPromise();
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

  //TODO:implement a method s.t. if isValidated = true and isPublished = true sets status validated 

  async manageVerification(id:string): Promise<void> {
    //TODO: set isValidated = true
  }
  async manageRejection(id:string): Promise<void> {
    //TODO: undo blockchain publication, set status as rejected, set isPublished= false, set isChecked = true
  }
  async managePublication(id:string): Promise<void> {
    //TODO: set isPublished = true
  }
  async managePublicationFailed(id:string): Promise<void> {
    //TODO: set isPublished = false, set  status as rejected
  }
  async manageReformed(id:string): Promise<void> {
    //TODO: reset the post
  }
}
