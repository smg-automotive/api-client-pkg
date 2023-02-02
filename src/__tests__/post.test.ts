import { listingClient } from '.jest/helpers/listingClient';
import { mockResolvedOnce } from '.jest/helpers/fetch';

describe('post', () => {
  it('calls fetch with POST', async () => {
    mockResolvedOnce({ id: '12345' });
    await listingClient
      .path('/listings/create')
      .post({ data: { make: 'bmw' } });
    expect(fetch).toHaveBeenCalledWith(
      'https://api.automotive.ch/api/listings/create',
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('calls fetch with an empty body', async () => {
    mockResolvedOnce(null);
    await listingClient.path('/calculate').post({ data: null });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('calculate'),
      expect.objectContaining({ body: null })
    );
  });

  it('applies a sanitizer', async () => {
    mockResolvedOnce({});
    const response = await listingClient
      .path('/listings/{listingId}/unsanitized', { listingId: 1 })
      .post({});

    expect(response.body).toEqual({ make: 'default make' });
  });
});
