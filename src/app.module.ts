import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QueueModule } from './queue/queue.module';
import { RedisModule } from './redis/redis.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    QueueModule, 
    RedisModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        QUEUE_SERVICE_REDIS_HOST: Joi.string().required(),
        QUEUE_SERVICE_REDIS_PASSWORD: Joi.string().required(),
        QUEUE_SERVICE_REDIS_PORT: Joi.string().required(),
        KITCHEN_SERVICE_SERVER: Joi.string().required(),
        KITCHEN_SERVICE_PORT: Joi.string().required(),
      }),
      envFilePath: './.env',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
