import { ApiClient } from '../index'
import { mockApiFailOnce, mockResolvedOnce } from '../../.jest/helpers/fetch'

describe('post', () => {
  beforeEach(() => {
    ApiClient.configure({
      baseUrl: 'https://api.automotive.ch/api',
    })
  })

  it('calls fetch with POST', async () => {
    mockResolvedOnce({ id: '12345' })
    await ApiClient.post<{ id: string }, { make: string }>('/listings/create', {
      make: 'bmw',
    })
    expect(fetch).toHaveBeenCalledWith(
      'https://api.automotive.ch/api/listings/create',
      expect.objectContaining({ method: 'POST' }),
    )
  })

  it('extracts the json value of the response', async () => {
    mockResolvedOnce({ id: '12345' })
    const data = await ApiClient.post<{ id: string }, { make: string }>(
      '/listings/create',
      { make: 'bmw' },
    )
    expect(data.id).toEqual('12345')
  })

  it('rejects if the request was not ok', async () => {
    mockApiFailOnce()
    await expect(
      ApiClient.post<string, string>('/listings/create', 'data'),
    ).rejects.toEqual(expect.any(Object))
  })

  it('throws if no parameters are passed', () => {
    expect(() => {
      ApiClient.post<{ id: string }, { make: string }>(
        'dealers/{dealerId}/listings/{listingId}',
        { make: 'bmw' },
        {},
      )
    }).toThrow()
  })

  it('throws if a parameter is missing', async () => {
    expect(() => {
      ApiClient.post<{ id: string }, { make: string }>(
        'dealers/{dealerId}/listings/{listingId}',
        { make: 'bmw' },
        {
          params: { listingId: 456 },
        },
      )
    }).toThrow(
      'Param {dealerId} missing. Expected parameters are: {dealerId}, {listingId}',
    )
  })

  it('replaces the parameter placeholders with the data', async () => {
    mockResolvedOnce({ data: '12345' })
    await ApiClient.post<{ id: string }, { make: string }>(
      'dealers/{dealerId}/listings/{listingId}',
      { make: 'bmw' },
      {
        params: { dealerId: 123, listingId: 456 },
      },
    )
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('dealers/123/listings/456'),
      expect.any(Object),
    )
  })

  it('calls fetch with an empty body', async () => {
    mockResolvedOnce(null)
    await ApiClient.post<{ id: string }, null>(
      'dealers/{dealerId}/listings/{listingId}',
      null,
      {
        params: { dealerId: 123, listingId: 456 },
      },
    )
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('dealers/123/listings/456'),
      expect.objectContaining({ body: null }),
    )
  })
})
