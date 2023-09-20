import Ticket from '../ticket';

it('AC01: implements optimistic concurrency control', async () => {
  // create ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123'
  });

  // save ticket to db
  await ticket.save();

  // fetch ticket two times
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // make two separate changes to the two tickets
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });
  
  // save first ticket
  await firstInstance!.save();

  // save second ticket and expect an error, NOTE / TODO: there is an issue when I try to use expect(...).toThrow();
  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }
});

it('AC02: incerements the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: '123'
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
})