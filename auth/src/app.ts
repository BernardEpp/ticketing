import express from "express";
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { currentUserRouter } from "./routes/current-user";
import { signupRouter } from "./routes/signup";
import { signoutRouter } from "./routes/signout";
import { signinRouter } from "./routes/signin";
import { errorHandler, NotFoundError } from '@bernard-tickets/common';

const app = express();
app.set('trust proxy', true); // we use ingress-nginx as a proxy
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test' // allow http in the test environment
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// app.get('/api/users/currentuser', (req, res) => {
//   console.log('received get request for currentuser.');
//   res.send('Hi there!');
// });

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export default app;