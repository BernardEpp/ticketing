import { OrderStatus } from '@bernard-tickets/common';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../app';
import { Order } from '../../models/order';

it('AC01: returns a 404 when the order does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'skdfj',
      orderId: new mongoose.Types.ObjectId().toHexString()
    })
    .expect(404);
});

it('AC02: returns a 401 when purchasing an order that does not belong to the user', async () => {
  const order = Order.build({
    id:new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created
  })
  await order.save();

  await request(app)
  .post('/api/payments')
  .set('Cookie', global.signin())
  .send({
    token: 'skdfj',
    orderId: order.id
  })
  .expect(401);


});

it('AC03: returns a 400 when purchasing a cancelled order', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id:new mongoose.Types.ObjectId().toHexString(),
    userId: userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled
  })
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      orderId: order.id,
      token: 'alskdjf'
    })
    .expect(400);


});