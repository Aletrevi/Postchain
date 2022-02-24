import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BlocksModule } from './blocks/blocks.module';
import { MinioClientModule } from './minio-client/minio-client.module';

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
        RABBITMQ_QUEUE_NAME: Joi.string().required(),
        MINIO_ENDPOINT: Joi.string().required(),
        MINIO_PORT: Joi.number().required(),
        MINIO_ACCESS_KEY: Joi.string().required(),
        MINIO_SECRET_KEY: Joi.string().required(),
        MINIO_BUCKET_NAME: Joi.string().required(),
      })
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // Mongodb uri composition using env variables
        uri: `mongodb://${configService.get('MONGO_USER')}:${configService.get('MONGO_PASSWORD')}@${configService.get('MONGO_HOST')}:${configService.get('MONGO_PORT')}/${configService.get('MONGO_DB')}`
      })
    }),
    BlocksModule,
    MinioClientModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
