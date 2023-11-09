import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';
import { RedisModule } from 'src/redis/redis.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KITCHEN_PACKAGE_NAME } from 'humf-proto/build/proto/kitchen';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    RedisModule,
    ClientsModule.registerAsync([
      {
        name: 'KITCHEN_PACKAGE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: `grpc://${configService.get<string>('KITCHEN_SERVICE_SERVER')}:${configService.get<string>('KITCHEN_SERVICE_PORT')}`,
            package: [KITCHEN_PACKAGE_NAME],
            protoPath: [join(__dirname, '../../proto/kitchen.proto')]
          }
        }),
        inject: [ConfigService],
      }
    ]),
    
  ],
  controllers: [QueueController],
  providers: [QueueService],
})
export class QueueModule {}
