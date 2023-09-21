import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from '@bernard-tickets/common';
import { queueGroupName } from './queue-group-name';
import Ticket from '../../models/ticket';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);
    // If no ticket, throw error
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    
    // mark the ticket by setting order id
    ticket.set({ orderId: data.id });
    
    await ticket.save();

    // acknowledge
    msg.ack();
  }

}