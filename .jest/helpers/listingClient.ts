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
    get: () => ResponseType<Listing>;
  };
  '/listings/search': {
    get: (data?: RequestType) => ResponseType<Listing>;
  };
  '/listings/{listingId}': {
    delete: () => ResponseType;
    put: (data: RequestTypeWithBody<Listing>) => ResponseType;
  };
  'dealers/{dealerId}/listings/{listingId}': {
    delete: () => ResponseType;
  };
  '/listings/create': {
    post: (data: RequestTypeWithBody<Listing>) => ResponseType;
  };
  '/calculate': {
    post: (data: RequestTypeWithBody<null>) => ResponseType;
  };
}

export const listingClient = ApiClient<ListingClient>();
