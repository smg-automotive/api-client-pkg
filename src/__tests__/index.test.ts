import { ApiClient } from '../index';
import {
  listingClient,
  ListingClientConfiguration,
} from '../../.jest/helpers/listingClient';
import { mockFetchFailOnce, mockResolvedOnce } from '../../.jest/helpers/fetch';

describe('ApiClient', () => {
  it('throws if there is no baseUrl', async () => {
    const throwingClient = ApiClient<ListingClientConfiguration>();
    await expect(async () => {
      await throwingClient.path('/listings/search').get();
    }).rejects.toThrow('FetchClient is not configured. Please pass a baseUrl.');
  });

  it('throws if fetch fails', async () => {
    mockFetchFailOnce();
    await expect(
      listingClient.path('/listings/search').get({
        options: {
          baseUrl: 'url',
        },
      })
    ).rejects.toThrow();
  });

  it('overwrites the configured baseUrl', async () => {
    mockResolvedOnce({ data: '12345' });
    await listingClient.path('/listings/search').get({
      options: {
        baseUrl: 'https://petstoreapi.ch',
      },
    });
    expect(fetch).toHaveBeenCalledWith(
      'https://petstoreapi.ch/listings/search',
      expect.any(Object)
    );
  });

  it('removes duplicated slashes', async () => {
    mockResolvedOnce({ data: '12345' });
    await listingClient.path('/listings/search').get({
      options: {
        baseUrl: 'https://petstoreapi.ch/',
      },
    });
    expect(fetch).toHaveBeenCalledWith(
      'https://petstoreapi.ch/listings/search',
      expect.any(Object)
    );
  });

  it('allows to configure a custom header', async () => {
    mockResolvedOnce({ data: '12345' });
    await listingClient.path('/listings/search').get({
      options: {
        baseUrl: 'https://petstoreapi.ch',
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'Content-Type': 'text/xml',
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'Accept-Language': 'fr-CH',
        },
      },
    });
    expect(fetch).toHaveBeenCalledWith(
      'https://petstoreapi.ch/listings/search',
      expect.objectContaining({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        headers: { 'Content-Type': 'text/xml', 'Accept-Language': 'fr-CH' },
      })
    );
  });

  it('merges the custom header with the configuration', async () => {
    mockResolvedOnce({ data: '12345' });
    const client = ApiClient<ListingClientConfiguration>({
      baseUrl: 'https://api.automotive.ch/api',
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Accept-Language': 'fr-CH',
      },
    });
    await client.path('/listings/search').get({
      options: {
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'Content-Type': 'text/xml',
        },
      },
    });
    expect(fetch).toHaveBeenCalledWith(
      'https://api.automotive.ch/api/listings/search',
      expect.objectContaining({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        headers: { 'Content-Type': 'text/xml', 'Accept-Language': 'fr-CH' },
      })
    );
  });

  it('creates an authorization header if access token is passed', async () => {
    mockResolvedOnce({ data: '12345' });
    await listingClient.path('/listings/search').get({
      options: {
        baseUrl: 'https://petstoreapi.ch',
        accessToken: 'abcdef',
      },
    });
    expect(fetch).toHaveBeenCalledWith(
      'https://petstoreapi.ch/listings/search',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer abcdef' }),
      })
    );
  });

  it('throws if no parameters are passed', async () => {
    await expect(async () => {
      await listingClient
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .path('dealers/{dealerId}/listings/{listingId}')
        .delete();
    }).rejects.toThrow();
  });

  it('throws if a parameter is missing', async () => {
    await expect(async () => {
      await listingClient
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .path('dealers/{dealerId}/listings/{listingId}', { listingId: 123 })
        .delete();
    }).rejects.toThrow(
      'Parameter dealerId missing. Expected parameters are: dealerId, listingId'
    );
  });

  it('replaces the parameter placeholders with the data', async () => {
    mockResolvedOnce({});
    await listingClient
      .path('dealers/{dealerId}/listings/{listingId}', {
        dealerId: 123,
        listingId: 456,
      })
      .delete();
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('dealers/123/listings/456'),
      expect.any(Object)
    );
  });

  it('ignores searchParams when not passed', async () => {
    mockResolvedOnce({ data: '12345' });
    await listingClient.path('/listings/search').get({
      options: {
        baseUrl: 'https://petstoreapi.ch/',
      },
    });
    expect(fetch).toHaveBeenCalledWith(
      'https://petstoreapi.ch/listings/search',
      expect.any(Object)
    );
  });

  it('adds searchParams', async () => {
    mockResolvedOnce({ data: '12345' });
    await listingClient.path('/listings/search').get({
      options: {
        baseUrl: 'https://petstoreapi.ch/',
        searchParams: { test: 'hereIAm' },
      },
    });
    expect(fetch).toHaveBeenCalledWith(
      'https://petstoreapi.ch/listings/search?test=hereIAm',
      expect.any(Object)
    );
  });
});
