import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'POST_SERVICE_EVENTS',
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
      provide: 'POST_SERVICE_TRIGGERS',
      useFactory: (configService: ConfigService) => {

        const rabbitmq_user = configService.get('RABBITMQ_USER');
        const rabbitmq_password = configService.get('RABBITMQ_PASSWORD');
        const rabbitmq_host = configService.get('RABBITMQ_HOST');
        const rabbitmq_port = configService.get('RABBITMQ_PORT');
        const rabbitmq_queue_name = configService.get('RABBITMQ_POST_SERVICE_TRIGGERS_QUEUE_NAME');

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
      provide: 'CHECKER_SERVICE_EVENTS',
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
      provide: 'CHECKER_SERVICE_TRIGGERS',
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
    },
    {
      provide: 'BC_INTERACTOR_EVENTS',
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
      provide: 'BC_INTERACTOR_TRIGGERS',
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
    }
  ],
})
export class AppModule {}
