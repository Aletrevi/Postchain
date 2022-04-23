import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Get configuration from Configuration Service
  const configService = app.get(ConfigService);
  const rabbitmq_user = configService.get('RABBITMQ_USER');
  const rabbitmq_password = configService.get('RABBITMQ_PASSWORD');
  const rabbitmq_host = configService.get('RABBITMQ_HOST');
  const rabbitmq_port = configService.get('RABBITMQ_PORT');
  const rabbitmq_queue_name = configService.get('RABBITMQ_QUEUE_NAME');

  // Connecting to message broker microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${rabbitmq_user}:${rabbitmq_password}@${rabbitmq_host}:${rabbitmq_port}`],
      queue: rabbitmq_queue_name,
      queueOptions: {
        durable: true
      },
    },
  });

  // Setup OPENAPI 
  const config = new DocumentBuilder()
  .setTitle('Blockchain interactor')
  .setDescription('The postchain Blockchain-interactor microservice API description')
  .setVersion('1.0')
  .addServer('/api/blockchain-interactor')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  // Validate request's data with DTO
  // TODO: validate id with custom validator https://stackoverflow.com/questions/49709429/decorator-to-return-a-404-in-a-nest-controller
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }));

  // Starting all microservices
  app.startAllMicroservices();

  // Starting http 
  const app_port = configService.get('PORT');
  await app.listen(app_port);
}
bootstrap();
