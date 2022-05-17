import { Module } from '@nestjs/common';
import { CheckerService } from './checker.service';
import { CheckerController } from './checker.controller';
import { Posts, PostsSchema } from './schemas/checker.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/common';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Posts.name, schema: PostsSchema }]),
    HttpModule,
  ],
  controllers: [CheckerController],
  providers: [CheckerService],
})
export class CheckerModule {}
