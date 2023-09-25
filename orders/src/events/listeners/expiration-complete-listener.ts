import { Listener, ExpirationCompleteEvent, Subjects } from "@bernard-tickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order, OrderStatus } from "../../models/order";
import { OrderCancelledEvent } from "@bernard-tickets/common";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";
import { isMissingDeclaration } from "typescript";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket');

    if (!order) {
      throw new Error('Order not found');
    }
    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    order.set({
      status: OrderStatus.Cancelled,
      // NOTE: we don't need to reset the ticket here as this is handled in the ticket model in the isReserved method
    });
    await order.save();

    new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      }
    });

    msg.ack();
  }
}