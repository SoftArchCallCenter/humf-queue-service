import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';
import { RedisModule } from 'src/redis/redis.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KITCHEN_PACKAGE_NAME } from 'humf-proto/build/proto/kitchen';
import { join } from 'path';

@Module({
  imports: [
    RedisModule,
    ClientsModule.register([
      {
        name: 'KITCHEN_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: process.env.KITCHEN_SERVICE_URL,
          package: [KITCHEN_PACKAGE_NAME],
          protoPath: [join(__dirname, '../../proto/kitchen.proto')]
        }
      }
    ])],
  controllers: [QueueController],
  providers: [QueueService],
})
export class QueueModule {}
