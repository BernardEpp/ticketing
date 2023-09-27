import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app';
import jwt from 'jsonwebtoken';

// This is for convenience to signin during the different test cases. It could also be put into a separate helper class. 
declare global {
  var signin: (id?: string) => string[];
}

jest.mock('../nats-wrapper');

// TODO: alternatively create a env variable so this does not get pushed into the public repo
process.env.STRIPE_KEY = 'sk_test_51NtuL7JRH3uhA2EwBCaDA8KM3bHhsly0DeawF6cRckHxB8MNnJdzVCNvVROfH6E23q3zzJ2GeOPLjymcDVQqjSmH009nx9JqqT'

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "asdasdg";
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  // build jwt payload { id, email }
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  }
  // Create (sign) the jwt with a key
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  
  // build session object { jwt: MY_JWT}
  const session = { jwt: token }; 

  // turn that session object into json
  const sessionJSON = JSON.stringify(session);

  // take json and decode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string thats the cookie with the encoded data
  return [`session=${base64}`];
}
