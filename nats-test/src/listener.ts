import nats, { Message, Stan } from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import TicketCreatedListener from './events/ticket-created-listener';

console.clear(); // clear console so we easily see the events for this test project

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222'
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed');
    process.exit();
  });

  new TicketCreatedListener(stan).listen();
});

// make sure to inform nats that this process was closed. Otherwise nats might keep sending events. 
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());



