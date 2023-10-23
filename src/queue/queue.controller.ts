import { Controller } from '@nestjs/common';
import { QueueService } from './queue.service';
import { Order, QueueServiceController, QueueServiceControllerMethods } from 'humf-proto/build/proto/queue';

@Controller()
@QueueServiceControllerMethods()
export class QueueController implements QueueServiceController{
  constructor(private readonly queueService: QueueService) {}

  createOrder(order: Order) {
    return this.queueService.createOrder(order);
  }
}
