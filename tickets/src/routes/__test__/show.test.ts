import request from 'supertest';
import app from '../../app';
import Ticket from '../../models/ticket';
import mongoose from 'mongoose'

it('AC01: returns a 404 if the ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString(); // create a well formatted id
  await request(app)
    .get(`/api/tickets/${id}`)
    .send()
    .expect(404);
});

it('AC02: returns the ticket if the ticket is found ', async () => {
  const title = 'testTitle';
  const price = 20;

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title, price
    })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});