import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlocksModule } from './blocks/blocks.module';

@Module({
  imports: [
    // TODO: configure ConfigModule:
    //    - concept variables separation 
    //    - improve validation
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot('mongodb+srv://sweetcap:skZJByOQdxgVOlRT@cluster0.afvax.mongodb.net/?retryWrites=true&w=majority'),
    BlocksModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService,
  ]
})
export class AppModule {}

