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
      // eslint-disable-next-line jest/no-conditional-expect
      expect(response.body.message).toEqual(
        'Failed to parse JSON response from https://api.automotive.ch/api/listings/1/unsanitized',
      );
      // eslint-disable-next-line jest/no-conditional-expect
      expect(response.body.globalErrors).toContainEqual(
        // eslint-disable-next-line jest/no-conditional-expect
        expect.objectContaining({
          code: 'JSON_PARSE_ERROR',
        }),
      );
    }
  });
});
