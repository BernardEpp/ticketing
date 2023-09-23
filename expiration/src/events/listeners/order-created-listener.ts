import { Listener, OrderCreatedEvent, Subjects } from '@bernard-tickets/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { expirationQueue } from '../../queues/expiration-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log('Waiting this many millisencond to process the job: ', delay);
    await expirationQueue.add({
      orderId: data.id,
    }, 
    // NOTE: comment out the delay here is useful for debugging the expiration mechanism
    {
      delay,
    }
    );


    msg.ack();
  }
}