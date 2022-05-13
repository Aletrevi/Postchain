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
    return axios
      .all([
        axios.get(
          'https://www.purgomalum.com/service/containsprofanity?text=' +
          createCheckerDto.title,
        ),
        axios.get(
          'https://www.purgomalum.com/service/containsprofanity?text=' +
          createCheckerDto.author,
        ),
        axios.get(
          'https://www.purgomalum.com/service/containsprofanity?text=' +
          createCheckerDto.body,
        ),
      ])
      .then(
        axios.spread((...responses) => {
          const responseOne = responses[0].data;
          const responseTwo = responses[1].data;
          const responesThree = responses[2].data;
          return !responseOne && !responseTwo && !responesThree;
        }),
      )
      .catch((errors) => {
        // react on errors.
      });
  }
}
