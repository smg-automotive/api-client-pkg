import { ApiClient } from '../index';
import { mockApiFailOnce, mockResolvedOnce } from '../../.jest';

describe('delete', () => {
  beforeEach(() => {
    ApiClient.configure({
      baseUrl: 'https://api.automotive.ch/api',
    });
  });

  it('calls fetch with DELETE', async () => {
    mockResolvedOnce({ data: '12345' });
    await ApiClient.delete({
      path: '/listings/{listingId}',
      params: {
        listingId: 123,
      },
    });
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: 'DELETE' })
    );
  });

  it('rejects if the request was not ok', async () => {
    mockApiFailOnce();
    await expect(
      ApiClient.delete({
        path: '/listings/{listingId}',
        params: {
          listingId: 123,
        },
      })
    ).rejects.toEqual(expect.any(Object));
  });

  it('throws if no parameters are passed', async () => {
    await expect(async () => {
      await ApiClient.delete({
        path: 'dealers/{dealerId}/listings/{listingId}',
        options: {},
      });
    }).rejects.toThrow();
  });

  it('throws if a parameter is missing', async () => {
    await expect(async () => {
      await ApiClient.delete({
        path: 'dealers/{dealerId}/listings/{listingId}',
        params: {
          listingId: 456,
        },
      });
    }).rejects.toThrow(
      'Param {dealerId} missing. Expected parameters are: {dealerId}, {listingId}'
    );
  });

  it('replaces the parameter placeholders with the data', async () => {
    mockResolvedOnce({});
    await ApiClient.delete({
      path: 'dealers/{dealerId}/listings/{listingId}',
      params: {
        dealerId: 123,
        listingId: 456,
      },
    });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('dealers/123/listings/456'),
      expect.any(Object)
    );
  });
});
