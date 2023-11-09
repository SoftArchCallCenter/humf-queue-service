import { NestFactory } from '@nestjs/core';
import { Transport } from "@nestjs/microservices";
import { AppModule } from './app.module';
import { join } from 'path';
import { QUEUE_PACKAGE_NAME } from 'humf-proto/build/proto/queue';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice( {
    transport: Transport.GRPC,
    options: {
      url: configService.get<string>('QUEUE_SERVICE_GRPC_URL'),
      package: [QUEUE_PACKAGE_NAME],
      protoPath: join(__dirname, '../proto/queue.proto'),
    }
  });
  await app.startAllMicroservices();
}
bootstrap();
