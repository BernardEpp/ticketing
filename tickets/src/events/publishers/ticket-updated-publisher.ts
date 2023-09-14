import { Publisher, Subjects, TicketUpdatedEvent } from '@bernard-tickets/common';

class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}

export { TicketUpdatedPublisher };

