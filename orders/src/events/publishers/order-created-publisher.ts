import { Publisher, OrderCreatedEvent, Subjects } from "@bernard-tickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
