import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { BadRequestError, NotFoundError, requireAuth, validateRequest } from '@bernard-tickets/common';
import mongoose from 'mongoose';
import { Ticket } from '../models/ticket';
import { Order, OrderStatus } from '../models/order';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const EXPIRATION_INTERVAL_SEC = 3 * 60; // expire orders after 15 minutes //TODO: extract to env variable

router.post('/api/orders', 
  requireAuth, 
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('TicketId must be provided')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // find the ticket in the db 
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    // ensure ticket is not reserved by someone else
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError('The Ticket is already reserved');
    }

    // calculate expiration date 
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_INTERVAL_SEC);
    
    // build order and save it
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });
    await order.save();

    // publish order created event
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });
    res.status(201).send(order);
  }
);

export { router as newOrderRouter };