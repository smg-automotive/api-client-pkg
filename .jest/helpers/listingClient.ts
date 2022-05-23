/* eslint-disable @typescript-eslint/naming-convention */

import {
  ResponseType,
  ApiClient,
  RequestTypeWithBody,
  ClientConfiguration,
  RequestType,
} from '../../src';

export type Listing = {
  make: string;
};

interface ListingClient extends ClientConfiguration {
  'dealers/{dealerId}/listings/{dealerId}': {
    get: () => Promise<ResponseType<Listing>>;
  };
  '/listings/search': {
    get: (data?: RequestType) => Promise<ResponseType<Listing>>;
  };
  '/listings/{listingId}': {
    delete: () => Promise<ResponseType>;
    put: (data: RequestTypeWithBody<Listing>) => Promise<ResponseType>;
  };
  'dealers/{dealerId}/listings/{listingId}': {
    delete: () => Promise<ResponseType>;
  };
  '/listings/create': {
    post: (data: RequestTypeWithBody<Listing>) => Promise<ResponseType>;
  };
  '/calculate': {
    post: (data: RequestTypeWithBody<null>) => Promise<ResponseType>;
  };
}

export const listingClient = ApiClient<ListingClient>();
