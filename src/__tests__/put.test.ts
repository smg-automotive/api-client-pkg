import { listingClient } from '../../.jest/helpers/listingClient';
import { mockResolvedOnce } from '../../.jest/helpers/fetch';

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
      expect.objectContaining({ method: 'PUT' })
    );
  });

  it('applies a sanitizer', async () => {
    mockResolvedOnce({});
    const response = await listingClient
      .path('/listings/{listingId}/unsanitized', { listingId: 1 })
      .put({});

    expect(response.body).toEqual({ make: 'default make' });
  });
});
