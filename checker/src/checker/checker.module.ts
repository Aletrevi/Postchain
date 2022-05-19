import { Module } from '@nestjs/common';
import { CheckerService } from './checker.service';
import { CheckerController } from './checker.controller';
import { Posts, PostsSchema } from './schemas/checker.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Posts.name, schema: PostsSchema }]),
    HttpModule,
  ],
  controllers: [CheckerController],
  providers: [CheckerService,{
    provide: 'RABBIT_EVENTS',
    useFactory: (configService: ConfigService) => {

      const rabbitmq_user = configService.get('RABBITMQ_USER');
      const rabbitmq_password = configService.get('RABBITMQ_PASSWORD');
      const rabbitmq_host = configService.get('RABBITMQ_HOST');
      const rabbitmq_port = configService.get('RABBITMQ_PORT');
      const rabbitmq_queue_name = configService.get('RABBITMQ_CHECKER_SERVICE_QUEUE_NAME');

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
      const rabbitmq_queue_name = configService.get('RABBITMQ_CHECKER_SERVICE_TRIGGERS_QUEUE_NAME');

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
  }],
})
export class CheckerModule {}
