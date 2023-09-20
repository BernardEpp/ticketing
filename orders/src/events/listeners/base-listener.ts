import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from '@bernard-tickets/common';

interface Event {
  subject: Subjects;
  data: any;
}

//TODO: this is for debuging only. I want to use the base class in the common project. But for some reason I get a compile error with it that the ide does not detect.
abstract class Listener<T extends Event> {
  abstract subject: T['subject'];
  /**
   * The name of the nats queue group. This is important if we run multiple listener instances.
   */
  abstract queueGroupName: string;
  private client: Stan;
  protected ackWait = 5 * 1000;
  abstract onMessage(data: T['data'], msg: Message): void;

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject, 
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on('message', (msg: Message) => {
      console.log(
        `Message received: ${this.subject} /  ${this.queueGroupName}`
      );

      const parsedData = this.parseMessage(msg);

      this.onMessage(parsedData, msg);
    })
  }
   
  parseMessage(msg: Message) {
    const data = msg.getData();

    return typeof data === 'string'
      ? JSON.parse(data)
      : JSON.parse(data.toString('utf8'));
  }
}

export { Listener };