import { listingClient } from '.jest/helpers/listingClient';
import { mockResolvedOnce, mockUnexpectedHTMLOnce } from '.jest/helpers/fetch';

describe('post', () => {
  it('calls fetch with POST', async () => {
    mockResolvedOnce({ id: '12345' });
    await listingClient
      .path('/listings/create')
      .post({ data: { make: 'bmw' } });
    expect(fetch).toHaveBeenCalledWith(
      'https://api.automotive.ch/api/listings/create',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('passes the cache options to fetch', async () => {
    mockResolvedOnce({ data: '12345' });
    await listingClient.path('/listings/create').post({
      data: { make: 'bmw' },
      options: {
        cache: 'no-store',
      },
    });
    expect(fetch).toHaveBeenCalledWith(
      'https://api.automotive.ch/api/listings/create',
      expect.objectContaining({ cache: 'no-store' }),
    );
  });

  it('passes the next options to fetch', async () => {
    mockResolvedOnce({ data: '12345' });
    await listingClient.path('/listings/create').post({
      data: { make: 'bmw' },
      options: {
        next: {
          revalidate: 10,
          tags: ['listings'],
        },
      },
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://api.automotive.ch/api/listings/create',
      expect.objectContaining({ next: { revalidate: 10, tags: ['listings'] } }),
    );
  });

  it('calls fetch with an empty body', async () => {
    mockResolvedOnce(null);
    await listingClient.path('/calculate').post({ data: null });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('calculate'),
      expect.objectContaining({ body: null }),
    );
  });

  it('applies a sanitizer', async () => {
    mockResolvedOnce({});
    const response = await listingClient
      .path('/listings/{listingId}/unsanitized', { listingId: 1 })
      .post({});

    expect(response.body).toEqual({ make: 'default make' });
  });

  it('handles JSON parsing errors', async () => {
    expect.assertions(2);

    mockUnexpectedHTMLOnce();
    const response = await listingClient
      .path('/listings/{listingId}/unsanitized', { listingId: 1 })
      .post({});

    if (!response.ok) {
      expect(response.body.message).toEqual(
        'Failed to parse JSON response from https://api.automotive.ch/api/listings/1/unsanitized',
      );

      expect(response.body.globalErrors).toContainEqual(
        expect.objectContaining({
          code: 'JSON_PARSE_ERROR',
        }),
      );
    }
  });
});
