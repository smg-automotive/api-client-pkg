import { ApiClient, ClientConfiguration } from '../index';
import { mockApiFailOnce, mockResolvedOnce } from '../../.jest';
import { MessageLeadClient } from '../iLiveInTheProject';

describe('get', () => {
  beforeEach(() => {
    ApiClient.configure({
      baseUrl: 'https://api.automotive.ch/api',
    });
  });

  it('calls fetch with GET', async () => {
    mockResolvedOnce({ data: '12345' });
    await MessageLeadClient.path(
      '/listings/{listingId}/message-leads/{messageLeadId}',
      200,
      100
    ).get();
    expect(fetch).toHaveBeenCalledWith(
      'https://api.automotive.ch/api/listings/200/message-leads/100',
      expect.objectContaining({ method: 'GET' })
    );
  });
});
