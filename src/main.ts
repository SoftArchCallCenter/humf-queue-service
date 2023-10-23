require('dotenv').config()
import { NestFactory } from '@nestjs/core';
import { Transport } from "@nestjs/microservices";
import { AppModule } from './app.module';
import { join } from 'path';
import { QUEUE_PACKAGE_NAME } from 'humf-proto/build/proto/queue';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: process.env.URL,
      package: [QUEUE_PACKAGE_NAME],
      protoPath: join(__dirname, '../proto/queue.proto'),
    }
  });
  app.listen()
}
bootstrap();
