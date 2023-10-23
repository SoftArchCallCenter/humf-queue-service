require("dotenv").config()
import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
// import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [ 
    CacheModule.registerAsync({
      useFactory:async () => ({
        store: await redisStore({
          url: process.env.REDIS_URI,
          ttl: 5000,
        }),
      }),
      isGlobal: true,
    })
  ],
  providers: [RedisService],
  exports: [RedisService]
})
export class RedisModule {}
