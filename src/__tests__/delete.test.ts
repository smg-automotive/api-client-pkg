import { listingClient } from '.jest/helpers/listingClient';
import { mockResolvedOnce, mockUnexpectedHTMLOnce } from '.jest/helpers/fetch';

describe('delete', () => {
  it('calls fetch with DELETE', async () => {
    mockResolvedOnce({ data: '12345' });
    await listingClient
      .path('/listings/{listingId}', { listingId: 123 })
      .delete();
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: 'DELETE' }),
    );
  });

  it('passes the cache options to fetch', async () => {
    mockResolvedOnce({ data: '12345' });
    await listingClient
      .path('/listings/{listingId}', { listingId: 123 })
      .delete({
        options: {
          cache: 'no-store',
        },
      });
    expect(fetch).toHaveBeenCalledWith(
      'https://api.automotive.ch/api/listings/123',
      expect.objectContaining({ cache: 'no-store' }),
    );
  });

  it('passes the next options to fetch', async () => {
    mockResolvedOnce({ data: '12345' });
    await listingClient
      .path('/listings/{listingId}', { listingId: 123 })
      .delete({
        options: {
          next: {
            revalidate: 10,
            tags: ['listings'],
          },
        },
      });

    expect(fetch).toHaveBeenCalledWith(
      'https://api.automotive.ch/api/listings/123',
      expect.objectContaining({ next: { revalidate: 10, tags: ['listings'] } }),
    );
  });

  it('applies a sanitizer', async () => {
    mockResolvedOnce({});
    const response = await listingClient
      .path('/listings/{listingId}/unsanitized', { listingId: 1 })
      .delete();

    expect(response.body).toEqual({ make: 'default make' });
  });

  it('handles JSON parsing errors', async () => {
    expect.assertions(2);

    mockUnexpectedHTMLOnce();
    const response = await listingClient
      .path('/listings/{listingId}/unsanitized', { listingId: 1 })
      .delete();

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
