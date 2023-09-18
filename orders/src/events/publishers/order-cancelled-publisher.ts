import { Publisher, OrderCancelledEvent, Subjects } from "@bernard-tickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}

