import {
  ResponseType,
  ApiClient,
  ClientConfiguration,
  RequestType,
} from '../../src';

export type Listing = {
  make: string;
};

export interface ListingClientConfiguration extends ClientConfiguration {
  'dealers/{dealerId}/listings/{dealerId}': {
    get: () => ResponseType<Listing>;
  };
  '/listings/search': {
    get: (data?: RequestType) => ResponseType<Listing>;
  };
  '/listings/{listingId}': {
    delete: () => ResponseType;
    put: (data: RequestType<Listing>) => ResponseType;
  };
  'dealers/{dealerId}/listings/{listingId}': {
    delete: () => ResponseType;
  };
  '/listings/create': {
    post: (data: RequestType<Listing>) => ResponseType;
  };
  '/calculate': {
    post: (data: RequestType<null>) => ResponseType;
  };
}

export const listingClient = ApiClient<ListingClientConfiguration>({
  baseUrl: 'https://api.automotive.ch/api',
});
