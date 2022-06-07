import { Injectable, Inject, HttpService} from '@nestjs/common';
import { ClientProxy} from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCheckerDto } from './dto/create-checker.dto';
import { UpdateCheckerDto } from './dto/update-checker.dto';
import { Posts, PostsDocument } from './schemas/checker.schema';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators'

@Injectable()
export class CheckerService {
  constructor( private httpService: HttpService,
    @Inject('RABBIT_EVENTS') private readonly eventsClient: ClientProxy,
    @InjectModel(Posts.name) private readonly postModel: Model<PostsDocument>,
  ) {}

  async checkPost(createCheckerDto: CreateCheckerDto) {
    let titleCheck = this.httpService.get(
          'https://www.purgomalum.com/service/containsprofanity?text=' +
          createCheckerDto.title,
        )
    let authorCheck = this.httpService.get(
          'https://www.purgomalum.com/service/containsprofanity?text=' +
          createCheckerDto.author,
        )
    let bodyCheck = this.httpService.get(
          'https://www.purgomalum.com/service/containsprofanity?text=' +
          createCheckerDto.body,
        )
      
    return combineLatest([titleCheck, authorCheck, bodyCheck]).pipe(
      map(([titleCheckRes, authorCheckRes, bodyCheckRes]) => {
        return !titleCheckRes.data && !authorCheckRes.data && !bodyCheckRes.data
      })
    )

  }

  async manageValidation(post:Posts): Promise<boolean> {
      let answer = await this.checkPost(post);
      if (answer)
        return true
      else
        return false
  }

}
