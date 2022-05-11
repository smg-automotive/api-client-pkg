import { ApiClient } from '../index'
import { mockApiFailOnce, mockResolvedOnce } from '../../.jest/helpers/fetch'

describe('get', () => {
  beforeEach(() => {
    ApiClient.configure({
      baseUrl: 'https://api.automotive.ch/api',
    })
  })

  it('calls fetch with GET', async () => {
    mockResolvedOnce({ data: '12345' })
    await ApiClient.get<{ data: string }>('/listings/search')
    expect(fetch).toHaveBeenCalledWith(
      'https://api.automotive.ch/api/listings/search',
      expect.objectContaining({ method: 'GET' }),
    )
  })

  it('extracts the json value of the response', async () => {
    mockResolvedOnce({ data: '12345' })
    const data = await ApiClient.get<{ data: string }>('/listings/search')
    expect(data.data).toEqual('12345')
  })

  it('rejects if the request was not ok', async () => {
    mockApiFailOnce()
    await expect(ApiClient.get<string>('/listings/create')).rejects.toEqual(
      expect.any(Object),
    )
  })

  it('throws if no parameters are passed', () => {
    expect(() => {
      ApiClient.get<{ data: string }>(
        'dealers/{dealerId}/listings/{listingId}',
        {},
      )
    }).toThrow()
  })

  it('throws if a parameter is missing', async () => {
    expect(() => {
      ApiClient.get<{ data: string }>(
        'dealers/{dealerId}/listings/{listingId}',
        {
          params: { listingId: 456 },
        },
      )
    }).toThrow(
      'Param {dealerId} missing. Expected parameters are: {dealerId}, {listingId}',
    )
  })

  it('replaces all occurrences if the parameters are named the same', async () => {
    mockResolvedOnce({ data: '12345' })
    await ApiClient.get<string>('dealers/{dealerId}/listings/{dealerId}', {
      params: { dealerId: 123 },
    })
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('dealers/123/listings/123'),
      expect.any(Object),
    )
  })

  it('replaces the parameter placeholders with the data', async () => {
    mockResolvedOnce({ data: '12345' })
    await ApiClient.get<string>('dealers/{dealerId}/listings/{listingId}', {
      params: { dealerId: 123, listingId: 456 },
    })
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('dealers/123/listings/456'),
      expect.any(Object),
    )
  })
})
