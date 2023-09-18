import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus} from "../../models/order";

it('AC01: marks an order as cancelled', async () => {
  // create ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  });
  await ticket.save();

  const user = global.signin();

  // create order with ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // cancel order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204)

  // assert cancellation
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it.todo('emits an order cancelled event');