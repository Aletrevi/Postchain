import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCheckerDto } from './dto/create-checker.dto';
import { UpdateCheckerDto } from './dto/update-checker.dto';
import { Posts, PostsDocument } from './schemas/checker.schema';
import axios from 'axios';

@Injectable()
export class CheckerService {
  constructor(
    @InjectModel(Posts.name) private readonly postModel: Model<PostsDocument>,
  ) {}

  async checkPost(createCheckerDto: CreateCheckerDto) {
    const checkTitle = axios.get(
      'https://www.purgomalum.com/service/containsprofanity?text=' +
      createCheckerDto.title,
    );
    const checkAuthor = axios.get(
      'https://www.purgomalum.com/service/containsprofanity?text=' +
      createCheckerDto.author,
    );
    const checkContent = axios.get(
      'https://www.purgomalum.com/service/containsprofanity?text=' +
      createCheckerDto.body,
    );

    checkTitle.then((titleResponse) => {
      console.log(`HELLO`);
      console.log(`Received response: ${!titleResponse.data}`);
      // console.log(`Received response: ${titleResponse.status}`);
      if (!titleResponse.data) {
        checkAuthor.then((authorResponse) => {
          console.log(`HELLO2`);
          console.log(`Received response: ${!authorResponse.data}`);
          // console.log(`Received response: ${authorResponse.status}`);
          if (!authorResponse.data) {
            checkContent.then((contentResponse) => {
              console.log(`HELLO3`);
              console.log(`Received response: ${!contentResponse.data}`);
              return contentResponse.data;
            });
          } else {
            return false;
          }
        });
      } else {
        return false;
      }
    });

    console.log('Started request...');
  }

  // findAll() {
  //   return `This action returns all checker`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} checker`;
  // }

  // update(id: number, updateCheckerDto: UpdateCheckerDto) {
  //   return `This action updates a #${id} checker`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} checker`;
  // }
}
