import express from "express";
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { createTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import { indexTicketRouter } from "./routes";
import { updateTicketRouter } from "./routes/update";
import { errorHandler, NotFoundError, currentUser } from '@bernard-tickets/common';

const app = express();
app.set('trust proxy', true); // we use ingress-nginx as a proxy
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test' // allow http in the test environment
  })
);
app.use(currentUser);

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

// app.get('/api/users/currentuser', (req, res) => {
//   console.log('received get request for currentuser.');
//   res.send('Hi there!');
// });

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export default app;