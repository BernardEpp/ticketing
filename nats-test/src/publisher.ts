import nats from 'node-nats-streaming';
import {TicketCreatedPublisher} from './events/ticket-created-publisher';

console.clear(); // clear console so we easily see the events for this test project

// stan is nats backwards and a common name for this, you could also call this 'client'
const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222'
});

 stan.on('connect', async () => {
  console.log('Publisher connected to NATS');

  const publisher = new TicketCreatedPublisher(stan);
  try {
    await publisher.publish({
      id: '123',
      title: 'concert',
      price: 20,
    });
  } catch(err) {
    console.error(err);
  }
  // const data = JSON.stringify({
  //   id: '123',
  //   title: 'concert',
  //   price: 20,
  // });

  // stan.publish('ticket:created', data, () => {
  //   console.log('Event published');
  // });
 })