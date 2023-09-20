import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it('AC01: fetches the order', async () => {
  // create a ticket
  const ticket = Ticket.build({
    id: 'asdfasdf',
    title: 'concert',
    price: 20
  });
  await ticket.save();

  const user = global.signin();
  // request to build order with ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // fetch order
  const { body: fetchedOrder} = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
})

it('AC02: returns an error if one users tries to fetch another users order', async () => {
  // create a ticket
  const ticket = Ticket.build({
    id: 'asdfasdf',
    title: 'concert',
    price: 20
  });
  await ticket.save();

  const user = global.signin();
  // request to build order with ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // fetch order
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(401);
})