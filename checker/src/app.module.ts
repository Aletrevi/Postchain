import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CheckerModule } from './checker/checker.module';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }), 

    MongooseModule.forRoot(
      'mongodb+srv://sweetcap:skZJByOQdxgVOlRT@cluster0.afvax.mongodb.net/?retryWrites=true&w=majority',
    ),
    CheckerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
