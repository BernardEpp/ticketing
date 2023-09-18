import express, { Request, Response} from 'express';
import { requireAuth } from '@bernard-tickets/common';
import { Order } from '../models/order';

const router = express.Router();

router.get('/api/orders', async (req: Request, res: Response) => {
  // console.log('requests orders');
  const orders = await Order.find({ 
    userId: req.currentUser!.id
  }).populate('ticket');

  res.send(orders);
});



export { router as indexOrderRouter }