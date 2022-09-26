import { listingClient } from '../../.jest/helpers/listingClient';
import { mockResolvedOnce } from '../../.jest/helpers/fetch';

describe('delete', () => {
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
