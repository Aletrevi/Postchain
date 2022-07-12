import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Get configuration from Configuration Service
  const configService = app.get(ConfigService);
  const rabbitmq_user = configService.get('RABBITMQ_USER');
  const rabbitmq_password = configService.get('RABBITMQ_PASSWORD');
  const rabbitmq_host = configService.get('RABBITMQ_HOST');
  const rabbitmq_port = configService.get('RABBITMQ_PORT');
  const rabbitmq_queue_name = configService.get('RABBITMQ_POST_SERVICE_TRIGGERS_QUEUE_NAME');

  // Connecting to message broker microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${rabbitmq_user}:${rabbitmq_password}@${rabbitmq_host}:${rabbitmq_port}`],
      queue: rabbitmq_queue_name,
      queueOptions: {
        durable: true
      },
    }
  })
  
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(9232,'0.0.0.0');
    // Starting all microservices
    app.startAllMicroservices();
}
bootstrap();
