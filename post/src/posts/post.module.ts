import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsController } from './post.controller';
import { PostsService } from './post.service';
import { Posts, PostsSchema } from './schemas/post.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Posts.name, schema: PostsSchema }]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [PostsController],
  providers: [PostsService,
    {
      provide: 'RABBIT_EVENTS',
      useFactory: (configService: ConfigService) => {

        const rabbitmq_user = configService.get('RABBITMQ_USER');
        const rabbitmq_password = configService.get('RABBITMQ_PASSWORD');
        const rabbitmq_host = configService.get('RABBITMQ_HOST');
        const rabbitmq_port = configService.get('RABBITMQ_PORT');
        const rabbitmq_queue_name = configService.get('RABBITMQ_POST_SERVICE_EVENTS_QUEUE_NAME');

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
        const rabbitmq_queue_name = configService.get('RABBITMQ_POSTS_TRIGGERS_QUEUE_NAME');

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
    },],
  
})
export class PostsModule {}
