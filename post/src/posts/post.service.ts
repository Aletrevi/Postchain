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

  async manageApproval(id:string): Promise<Posts> {
    
      let post = await this.postModel.findById(id).exec()
      let updateQuery = {}
      if(post.isPublished)
        { 
          updateQuery = {status:'approved' ,isChecked:true, checkPassed: true}
        
        }
        else {
          updateQuery = {isChecked:true, checkPassed: true}
          
        }
      
      return this.postModel.findByIdAndUpdate(id,updateQuery ).exec()
  }
  async manageRejection(id:string): Promise<Posts> {
  
          return this.postModel.findByIdAndUpdate(id,{status:'rejected', isChecked: true, checkPassed: false}).exec()

  }
  async managePublication(id:string): Promise<Posts> {
    
    let post = await this.postModel.findById(id).exec()
    let updateQuery = {}
    if(post.isChecked && post.checkPassed)
      { 
        updateQuery = {status:'approved' ,isPublished:true}
        
       
      }
      else {
        updateQuery = {isPublished: true}
     
        
      }
   
    return this.postModel.findByIdAndUpdate(id,updateQuery).exec()


  }
  async managePublicationFailed(id:string): Promise<Posts> {
    let post = await this.postModel.findById(id).exec()
       
      return this.postModel.findByIdAndUpdate(id,{ isPublished: false})
    
    
  }

 
 
}
