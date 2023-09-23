import { Subjects, Publisher, ExpirationCompleteEvent } from "@bernard-tickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;

  
}