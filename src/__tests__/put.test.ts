import { ApiClient } from '../index'
import { mockApiFailOnce, mockResolvedOnce } from '../../.jest/helpers/fetch'

describe('put', () => {
  beforeEach(() => {
    ApiClient.configure({
      baseUrl: 'https://api.automotive.ch/api',
    })
  })

  it('calls fetch with PUT', async () => {
    mockResolvedOnce({ id: '12345' })
    await ApiClient.put<string, { make: string }>({
      path: '/listings/update',
      body: {
        make: 'bmw',
      },
    })
    expect(fetch).toHaveBeenCalledWith(
      'https://api.automotive.ch/api/listings/update',
      expect.objectContaining({ method: 'PUT' }),
    )
  })

  it('extracts the json value of the response', async () => {
    mockResolvedOnce({ id: '12345' })
    const data = await ApiClient.put<{ id: string }, { make: string }>({
      path: '/listings/update',
      body: {
        make: 'bmw',
      },
    })
    expect(data.id).toEqual('12345')
  })

  it('rejects if the request was not ok', async () => {
    mockApiFailOnce()
    await expect(
      ApiClient.put<string, string>({ path: '/listings/update', body: 'data' }),
    ).rejects.toEqual(expect.any(Object))
  })

  it('throws if no parameters are passed', async () => {
    await expect(async () => {
      await ApiClient.put<{ id: string }, { make: string }>({
        path: 'dealers/{dealerId}/listings/{listingId}',
        body: {
          make: 'bmw',
        },
        params: {},
      })
    }).rejects.toThrow()
  })

  it('throws if a parameter is missing', async () => {
    await expect(async () => {
      await ApiClient.put<{ id: string }, { make: string }>({
        path: 'dealers/{dealerId}/listings/{listingId}',
        body: {
          make: 'bmw',
        },
        params: {
          listingId: 456,
        },
      })
    }).rejects.toThrow(
      'Param {dealerId} missing. Expected parameters are: {dealerId}, {listingId}',
    )
  })

  it('replaces the parameter placeholders with the data', async () => {
    mockResolvedOnce({ data: '12345' })
    await ApiClient.put<{ id: string }, { make: string }>({
      path: 'dealers/{dealerId}/listings/{listingId}',
      body: {
        make: 'bmw',
      },
      params: {
        dealerId: 123,
        listingId: 456,
      },
    })
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('dealers/123/listings/456'),
      expect.any(Object),
    )
  })
})