import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CheckerModule } from './checker/checker.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://sweetcap:skZJByOQdxgVOlRT@cluster0.afvax.mongodb.net/?retryWrites=true&w=majority',
    ),
    CheckerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
