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
    await ApiClient.post<{ id: string }, { make: string }>({
      path: '/listings/create',
      body: {
        make: 'bmw',
      },
    })
    expect(fetch).toHaveBeenCalledWith(
      'https://api.automotive.ch/api/listings/create',
      expect.objectContaining({ method: 'POST' }),
    )
  })

  it('extracts the json value of the response', async () => {
    mockResolvedOnce({ id: '12345' })
    const data = await ApiClient.post<{ id: string }, { make: string }>({
      path: '/listings/create',
      body: {
        make: 'bmw',
      },
    })
    expect(data.id).toEqual('12345')
  })

  it('rejects if the request was not ok', async () => {
    mockApiFailOnce()
    await expect(
      ApiClient.post<string, string>({
        path: '/listings/create',
        body: 'data',
      }),
    ).rejects.toEqual(expect.any(Object))
  })

  it('throws if no parameters are passed', async () => {
    await expect(async () => {
      await ApiClient.post<{ id: string }, { make: string }>({
        path: 'dealers/{dealerId}/listings/{listingId}',
        body: {
          make: 'bmw',
        },
        options: {},
      })
    }).rejects.toThrow()
  })

  it('throws if a parameter is missing', async () => {
    await expect(async () => {
      await ApiClient.post<{ id: string }, { make: string }>({
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
    await ApiClient.post<{ id: string }, { make: string }>({
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

  it('calls fetch with an empty body', async () => {
    mockResolvedOnce(null)
    await ApiClient.post<{ id: string }, null>({
      path: 'dealers/{dealerId}/listings/{listingId}',
      body: null,
      params: {
        dealerId: 123,
        listingId: 456,
      },
    })
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('dealers/123/listings/456'),
      expect.objectContaining({ body: null }),
    )
  })
})
