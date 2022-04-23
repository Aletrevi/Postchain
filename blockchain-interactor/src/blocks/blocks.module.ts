import { Module } from '@nestjs/common';
import { BlocksService } from './blocks.service';
import { BlocksController } from './blocks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Block, BlockSchema } from './schemas/block.schema';
import Joi from '@hapi/joi';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Block.name, schema: BlockSchema}]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [BlocksController],
  providers: [
    BlocksService,
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
export class BlocksModule {}
