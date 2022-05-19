import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { BlocksModule } from './blocks/blocks.module';

@Module({
  imports: [
    // TODO: configure ConfigModule:
    //    - concept variables separation 
    //    - improve validation
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        MONGO_USER: Joi.string().required(),
        MONGO_PASSWORD: Joi.string().required(),
        MONGO_HOST: Joi.string().required(),
        MONGO_PORT: Joi.number().required(),
        MONGO_DB: Joi.string().required(),
        INFURA_URL: Joi.string().required(),
        WALLET_ADDRESS: Joi.string().required(),
        WALLET_PRIVATE_KEY: Joi.string().required(),
        INFURA_TOKEN: Joi.string().required(),
        ETHERSCAN_URL: Joi.string().required(),
        RABBITMQ_USER: Joi.string().required(),
        RABBITMQ_PASSWORD: Joi.string().required(),
        RABBITMQ_HOST: Joi.string().required(),
        RABBITMQ_PORT: Joi.number().required(),
      })
    }),
    MongooseModule.forRoot('mongodb+srv://sweetcap:skZJByOQdxgVOlRT@cluster0.afvax.mongodb.net/?retryWrites=true&w=majority'),
    BlocksModule,
  ],
  controllers: [],
})
export class AppModule {}

