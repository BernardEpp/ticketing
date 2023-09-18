import express, { Request, Response } from 'express';
import { NotAuthorizedError, NotFoundError, requireAuth } from '@bernard-tickets/common';
import { Order, OrderStatus } from '../models/order';
const router = express.Router();
import { natsWrapper } from '../nats-wrapper';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';

//todo: consider make this a patch request
router.delete('/api/orders/:orderId', requireAuth, async (req: Request, res: Response ) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId).populate('ticket');

  if(!order) {
    throw new NotFoundError();
  }
  if(order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }
  order.status = OrderStatus.Cancelled;
  await order.save();

  new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    ticket: {
      id: order.ticket.id,
    },
  });

  res.status(204).send(order);
})

export { router as deleteOrderRouter };