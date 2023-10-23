import { Injectable, UseInterceptors } from '@nestjs/common';
import { Order } from 'humf-proto/build/proto/queue';
import { RedisService } from 'src/redis/redis.service';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Injectable()
export class QueueService {

    constructor(
        private readonly redisService: RedisService
    ) {}

    @UseInterceptors(CacheInterceptor)
    async createOrder(order:Order){
        const resId = order.resId;
        const kitchen:Order[] = await this.redisService.get(`kitchen_${resId}`) as Order[];
        if (kitchen){
            console.log("CACHED");
            kitchen.push(order)
            console.log(kitchen);
            this.redisService.set(`kitchen_${resId}`, kitchen)
            return order
        }
        console.log('NOT CACHED!');
        this.redisService.createQueue(`kitchen_${resId}`, [order])
        return order
    }
}
