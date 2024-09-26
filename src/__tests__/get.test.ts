import { Listing, listingClient } from '.jest/helpers/listingClient';
import {
  mockApiFailOnce,
  mockResolvedOnce,
  mockUnexpectedHTMLOnce,
} from '.jest/helpers/fetch';

describe('get', () => {
  it('calls fetch with GET', async () => {
    mockResolvedOnce({ make: 'bmw' });
    await listingClient.path('/listings/search').get();
    expect(fetch).toHaveBeenCalledWith(
      'https://api.automotive.ch/api/listings/search',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('applies a sanitizer', async () => {
    mockResolvedOnce({});
    const response = await listingClient
      .path('/listings/{listingId}/unsanitized', { listingId: 1 })
      .get();

    expect(response.body).toEqual({ make: 'default make' });
  });

  it('extracts the json value of the response', async () => {
    mockResolvedOnce({ make: 'bmw' });
    const { body } = await listingClient.path('/listings/search').get();
    expect((body as Listing).make).toEqual('bmw');
  });

  it('has an error object if the request was not ok', async () => {
    expect.assertions(1);

    mockApiFailOnce();
    const data = await listingClient.path('/listings/search').get();
    if (!data.ok) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(data?.body?.message).toEqual('Wrong data format');
    }
  });

  it('handles JSON parsing errors', async () => {
    expect.assertions(2);

    mockUnexpectedHTMLOnce();
    const response = await listingClient.path('/listings/search').get();

    if (!response.ok) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(response.body.message).toEqual(
        'Failed to parse JSON response from https://api.automotive.ch/api/listings/search',
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
