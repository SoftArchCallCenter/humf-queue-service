import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { ConfigService } from '@nestjs/config';
// import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [ 
    CacheModule.registerAsync({
      useFactory:async (configService: ConfigService) => ({
        store: await redisStore({
          url: `redis://:${configService.get<string>('QUEUE_SERVICE_REDIS_PASSWORD')}@${configService.get<string>('QUEUE_SERVICE_REDIS_HOST')}:${configService.get<string>('QUEUE_SERVICE_REDIS_PORT')}`,
          ttl: 5000,
        }),
      }),
      isGlobal: true,
      inject: [ConfigService],
    })
  ],
  providers: [RedisService],
  exports: [RedisService]
})
export class RedisModule {}
