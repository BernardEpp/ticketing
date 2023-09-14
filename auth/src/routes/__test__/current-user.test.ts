import request from 'supertest';
import app from '../../app';

it('AC01: responds with details about the current user', async () => {
  // use the default signin for testing and set the cookie in the follow up requests (which normaly is done by the browser)
  const cookie = await global.signin(); 

  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('AC02: fails if not authenticated',async () => {
  const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(401);

  // expect(response.body.currentUser).toEqual(null);
});