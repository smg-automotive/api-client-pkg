import { listingClient } from './listingClient';
import { initApiClient } from '../index';
import { mockResolvedOnce } from '../../.jest';

describe('put', () => {
  beforeEach(() => {
    initApiClient({
      baseUrl: 'https://api.automotive.ch/api',
    });
  });

  it('calls fetch with PUT', async () => {
    mockResolvedOnce({ id: '12345' });
    await listingClient.path('/listings/{listingId}', { listingId: 123 }).put({
      data: {
        make: 'bmw',
      },
    });
    expect(fetch).toHaveBeenCalledWith(
      'https://api.automotive.ch/api/listings/update',
      expect.objectContaining({ method: 'PUT' })
    );
  });
});
