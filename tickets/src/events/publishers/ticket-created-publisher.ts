import { Publisher, Subjects, TicketCreatedEvent } from '@bernard-tickets/common';

class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated; // we do the type annotation as well as the assignment so we cannot change the type at any point in time. 
}

export { TicketCreatedPublisher };