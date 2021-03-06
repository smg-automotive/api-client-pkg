import { listingClient, mockResolvedOnce } from '../../.jest';

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
});
