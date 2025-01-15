import { listingClient } from '.jest/helpers/listingClient';
import { mockResolvedOnce, mockUnexpectedHTMLOnce } from '.jest/helpers/fetch';

describe('put', () => {
  it('calls fetch with PUT', async () => {
    mockResolvedOnce({ id: '12345' });
    await listingClient.path('/listings/{listingId}', { listingId: 123 }).put({
      data: {
        make: 'bmw',
      },
    });
    expect(fetch).toHaveBeenCalledWith(
      'https://api.automotive.ch/api/listings/123',
      expect.objectContaining({ method: 'PUT' }),
    );
  });

  it('applies a sanitizer', async () => {
    mockResolvedOnce({});
    const response = await listingClient
      .path('/listings/{listingId}/unsanitized', { listingId: 1 })
      .put({});

    expect(response.body).toEqual({ make: 'default make' });
  });

  it('handles JSON parsing errors', async () => {
    expect.assertions(2);

    mockUnexpectedHTMLOnce();
    const response = await listingClient
      .path('/listings/{listingId}/unsanitized', { listingId: 1 })
      .put({});

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
