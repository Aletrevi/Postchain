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
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // Mongodb uri composition using env variables
        uri: `mongodb://${configService.get('MONGO_USER')}:${configService.get('MONGO_PASSWORD')}@${configService.get('MONGO_HOST')}:${configService.get('MONGO_PORT')}/${configService.get('MONGO_DB')}`
      })
    }),
    BlocksModule,
  ],
  controllers: [],
  providers: [
    {
      provide: 'RABBIT_EVENTS',
      useFactory: (configService: ConfigService) => {

        const rabbitmq_user = configService.get('RABBITMQ_USER');
        const rabbitmq_password = configService.get('RABBITMQ_PASSWORD');
        const rabbitmq_host = configService.get('RABBITMQ_HOST');
        const rabbitmq_port = configService.get('RABBITMQ_PORT');
        const rabbitmq_queue_name = configService.get('RABBITMQ_BC_INTERACTOR_QUEUE_NAME');

        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${rabbitmq_user}:${rabbitmq_password}@${rabbitmq_host}:${rabbitmq_port}`],
            queue: rabbitmq_queue_name,
            queueOptions: {
              durable: false
            },
          },
        });
      },
      inject: [ConfigService],
    },
    {
      provide: 'RABBIT_TRIGGERS',
      useFactory: (configService: ConfigService) => {

        const rabbitmq_user = configService.get('RABBITMQ_USER');
        const rabbitmq_password = configService.get('RABBITMQ_PASSWORD');
        const rabbitmq_host = configService.get('RABBITMQ_HOST');
        const rabbitmq_port = configService.get('RABBITMQ_PORT');
        const rabbitmq_queue_name = configService.get('RABBITMQ_BC_INTERACTIR_TRIGGERS_QUEUE_NAME');

        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${rabbitmq_user}:${rabbitmq_password}@${rabbitmq_host}:${rabbitmq_port}`],
            queue: rabbitmq_queue_name,
            queueOptions: {
              durable: false
            },
          },
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}

