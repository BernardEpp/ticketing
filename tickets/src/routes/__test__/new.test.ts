import { response } from 'express';
import request from 'supertest';
import app from '../../app';
import Ticket  from '../../models/ticket';

it('AC01: has a route handler listening to /api/tickets for post request', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .send({});
  expect(response.status).not.toEqual(404);
});

it('AC02: can only be accessed if the user is signed in', async () => {
  await request(app)
    .post('/api/tickets')
    .send({})
    .expect(401);
});

it('AC03: returns an error if an invalid title is provided', async () => {
  await request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({
    title: '',
    price: 10
  })
  .expect(400);

  await request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({
    price: 10
  })
  .expect(400);
});

it('AC04: returns an error if an invalid price is provided', async () => {
  await request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({
    title: 'adsfsg',
    price: -1
  })
  .expect(400);

  await request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({
    title: 'adsfsg',
    price: 0
  })
  .expect(400);

  await request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({
    title: 'adsfsg',
  })
  .expect(400);
});

it('AC05: creates a ticket with valid inputs', async () => {
  //TODO: add in a check to make sure a ticket was saved
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const title = 'asdjalsdf';

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: title,
      price: 20
    })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(20);
  expect(tickets[0].title).toEqual(title);
});

it('AC06: returns a status other than 401 of the user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
})