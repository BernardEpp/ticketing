/**
 * In NATS a subject can be called a channel as well.
 * We define this to ensure consistency between listeners and publishers regarding the event channels.
 *  
*/
enum Subjects{
  TicketCreated = 'ticket:created',
  OrderUpdated = 'order:updated'
};

export { Subjects };