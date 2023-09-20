import { Message } from 'node-nats-streaming';
import { Subjects, TicketCreatedEvent } from '@bernard-tickets/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';
// import { Listener } from '@bernard-tickets/common';
import { Listener }  from './base-listener'; //TODO: use listener from common project once bug is solved

class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log('on message of ticket created listener');
    const { id, title, price } = data;

    const ticket = Ticket.build({
      id,
      title,
      price,
    });
    await ticket.save();

    msg.ack();
  }
}

export { TicketCreatedListener };