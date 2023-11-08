import { Injectable, Inject, UseInterceptors, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { AcceptOrderDto, Order, RestaurantId } from 'humf-proto/build/proto/queue';
import { RedisService } from 'src/redis/redis.service';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { KitchenServiceClient } from 'humf-proto/build/proto/kitchen';
import { map, lastValueFrom } from 'rxjs';

@Injectable()
export class QueueService  implements OnModuleInit {

    private kitchenService: KitchenServiceClient;

    constructor(
        private readonly redisService: RedisService,
        @Inject('KITCHEN_PACKAGE') private client: ClientGrpc
    ) {}

    onModuleInit() {
        this.kitchenService = this.client.getService<KitchenServiceClient>("KitchenService");
    }

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

    async consumeQueue(resId: RestaurantId){
        const order:Order = await this.redisService.getQueueHead(`kitchen_${resId.id}`) as Order | null;
        if (order){
            return order
        }
        return {userId: undefined,resId: undefined, menus: null}
    }

    async acceptOrder(acceptOrderDto: AcceptOrderDto){
        const order:Order = await this.redisService.consumeQueue(`kitchen_${acceptOrderDto.resId}`) as Order | null;
        if (order){
            if (acceptOrderDto.accept){
                await lastValueFrom(
                    this.kitchenService.createTicket(order).pipe(map(res => console.log(res)))
                )
            }
            return order
        }
        return {userId: undefined,resId: undefined, menus: null}
    }
}
