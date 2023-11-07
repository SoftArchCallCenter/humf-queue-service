import { Inject, Injectable } from '@nestjs/common';
import {CACHE_MANAGER} from '@nestjs/cache-manager'
import {Cache} from 'cache-manager'

@Injectable()
export class RedisService {
    constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache){}

    async get(key: string){
        console.log(`GET ${key} from REDIS`);
        return await this.cache.get(key);
    }

    async getQueueHead(key: string){
        const value:unknown[] = await this.cache.get(key);
        if(value){
            const order = value[0];
            return order
        }
        return null
    }

    async set(key:string, value: unknown){
        console.log(`SET ${key} from REDIS`);
        await this.cache.set(key, value,0);
    }

    async del(key:string){
        console.log(`DEL ${key} from REDIS`);
        await this.cache.del(key);
    }

    async createQueue(key: string, value:unknown){
        console.log(`CREATE ${key} queue from REDIS`);
        this.cache.set(key, value, 0)
    }

    async consumeQueue(key:string){
        const value:unknown[] = await this.cache.get(key);
        if(value){
            const order = value[0];
            if (value.length === 1){
                await this.del(key)   
            } else {
                value.shift()
                await this.set(key, value)
            }
            return order
        }
        return null
    }
}
