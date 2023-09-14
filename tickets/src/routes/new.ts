import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@bernard-tickets/common';
import Ticket from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post('/api/tickets', 
requireAuth, 
[
  body('title').not().isEmpty().withMessage('Title is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
],
validateRequest,
 async (req: Request, res: Response) => {
    const { title, price} = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id, // with the requireAuth we return early if currentUser is not defined
    });
    await ticket.save();

    // Note, that req.body.title might be different from ticket.title because of some hooks we defined for mongoose.
    new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId
    });

    res.status(201).send(ticket);
})

export { router as createTicketRouter };