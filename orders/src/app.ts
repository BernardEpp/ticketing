import express from "express";
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { deleteOrderRouter } from "./routes/delete";
import { indexOrderRouter } from "./routes";
import { newOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";
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

app.use(deleteOrderRouter);
app.use(indexOrderRouter);
app.use(newOrderRouter);
app.use(showOrderRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };