import { Configuration, StronglyTypedClient } from './index';

interface MessageLead {
  name: string;
}

interface IMessageLeadClient extends Configuration {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '/listings/{listingId}/message-leads/{messageLeadId}': {
    get: () => Promise<MessageLead>;
    put: (input: MessageLead) => Promise<void>;
  };
}

const MessageLeadClient = StronglyTypedClient<IMessageLeadClient>();

MessageLeadClient.path(
  '/listings/{listingId}/message-leads/{messageLeadId}',
  200,
  100
)
  .get()
  .then((res) => console.log(res));

MessageLeadClient.path(
  '/listings/{listingId}/message-leads/{messageLeadId}',
  200,
  100
)
  .put({ name: 'colin' })
  .then((res) => console.log(res));
