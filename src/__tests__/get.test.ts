import {
  Listing,
  listingClient,
  mockApiFailOnce,
  mockResolvedOnce,
} from '../../.jest';

describe('get', () => {
  it('calls fetch with GET', async () => {
    mockResolvedOnce({ make: 'bmw' });
    await listingClient.path('/listings/search').get();
    expect(fetch).toHaveBeenCalledWith(
      'https://api.automotive.ch/api/listings/search',
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('extracts the json value of the response', async () => {
    mockResolvedOnce({ make: 'bmw' });
    const { body } = await listingClient.path('/listings/search').get();
    expect((body as Listing).make).toEqual('bmw');
  });

  it('has an error object if the request was not ok', async () => {
    mockApiFailOnce();
    const data = await listingClient.path('/listings/search').get();
    if (!data.ok) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(data?.body?.message).toEqual('Wrong data format');
    }
  });
});
