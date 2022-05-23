import { initApiClient } from '../index';
import { listingClient, mockResolvedOnce } from '../../.jest';

describe('delete', () => {
  beforeEach(() => {
    initApiClient({
      baseUrl: 'https://api.automotive.ch/api',
    });
  });

  it('calls fetch with DELETE', async () => {
    mockResolvedOnce({ data: '12345' });
    await listingClient
      .path('/listings/{listingId}', { listingId: 123 })
      .delete();
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: 'DELETE' })
    );
  });
});
