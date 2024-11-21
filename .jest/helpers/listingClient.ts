import { ApiClient, ClientConfiguration, RequestType, ResponseType } from 'src';

export type Listing = {
  make: string;
};

export type Seller = {
  name: string;
};

interface DummySearchParams {
  test: string;
}

export interface ListingClientConfiguration extends ClientConfiguration {
  'dealers/{dealerId}/listings/{dealerId}': {
    get: () => ResponseType<never, Listing>;
  };
  '/listings/search': {
    get: (
      data?: RequestType<never, DummySearchParams>,
    ) => ResponseType<never, Listing>;
  };
  '/listings/{listingId}': {
    delete: () => ResponseType;
    put: (data: RequestType<Listing>) => ResponseType<Listing>;
  };
  'dealers/{dealerId}/listings/{listingId}': {
    delete: () => ResponseType;
  };
  '/listings/create': {
    post: (data: RequestType<Listing>) => ResponseType<Listing>;
  };
  '/calculate': {
    post: (data: RequestType<null>) => ResponseType<Listing>;
  };
  '/listings/{listingId}/unsanitized': {
    get: () => ResponseType<object, Listing>;
    post: (data: RequestType<Listing>) => ResponseType<object, Listing>;
    put: (data: RequestType<Listing>) => ResponseType<object, Listing>;
    delete: () => ResponseType<object, Listing>;
  };
}

const sanitizeListing = ({ make }: Partial<Listing>): Listing => ({
  make: make || 'default make',
});

export const listingClient = ApiClient<ListingClientConfiguration>({
  baseUrl: 'https://api.automotive.ch/api',
  sanitizers: {
    '/listings/{listingId}/unsanitized': {
      get: sanitizeListing,
      post: sanitizeListing,
      put: sanitizeListing,
      delete: sanitizeListing,
    },
  },
});

interface SellersSearchClientConfiguration extends ClientConfiguration {
  '/sellers/search': {
    post: (
      data: RequestType<Seller, DummySearchParams>,
    ) => ResponseType<object, Seller>;
    delete: (
      data: RequestType<Seller, DummySearchParams>,
    ) => ResponseType<object, Seller>;
  };
}

export const sellersSearchClient = ApiClient<SellersSearchClientConfiguration>({
  baseUrl: 'https://api.automotive.ch/api',
});
