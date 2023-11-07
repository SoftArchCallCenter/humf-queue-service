import { Controller } from '@nestjs/common';
import { QueueService } from './queue.service';
import { AcceptOrderDto, Order, QueueServiceController, QueueServiceControllerMethods, RestaurantId } from 'humf-proto/build/proto/queue';

@Controller()
@QueueServiceControllerMethods()
export class QueueController implements QueueServiceController{
  constructor(private readonly queueService: QueueService) {}

  createOrder(order: Order) {
    return this.queueService.createOrder(order);
  }

  consumeQueue(restaurantId: RestaurantId){
    return this.queueService.consumeQueue(restaurantId);
  }

  acceptOrder(acceptOrderDto: AcceptOrderDto){
    return this.queueService.acceptOrder(acceptOrderDto); 
  }
}
