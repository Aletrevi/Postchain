import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/post.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://nursaadat:yA096um5LaCliVXl@runtimesposts.afvax.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    ),
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
