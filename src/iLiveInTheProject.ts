import { ClientConfiguration, StronglyTypedClient } from './index';

interface MessageLead {
  name: string;
}

interface IMessageLeadClient extends ClientConfiguration {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '/listings/{listingId}/message-leads/{messageLeadId}': {
    get: () => Promise<MessageLead>;
    put: (input: MessageLead) => Promise<void>;
  };
}

export const MessageLeadClient = StronglyTypedClient<IMessageLeadClient>();
