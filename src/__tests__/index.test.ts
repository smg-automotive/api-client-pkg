import fetchMock from 'jest-fetch-mock'
import ApiClient from '../index'

describe('ApiClient', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('throws if there is no baseUrl', () => {
    expect(() => {
      ApiClient.get<{ data: string }>('/listings/search')
    }).toThrow(
      'ApiClient is not configured. Please run ApiClient.configure() or pass a custom baseUrl.',
    )
  })

  it('overwrites the configured baseUrl', async () => {
    ApiClient.configure({
      baseUrl: 'https://api.automotive.ch/api',
    })
    fetchMock.mockResponseOnce(JSON.stringify({ data: '12345' }))
    await ApiClient.get<{ data: string }>('/listings/search', {
      baseUrl: 'https://petstoreapi.ch',
    })
    expect(fetch).toHaveBeenCalledWith(
      'https://petstoreapi.ch/listings/search',
      expect.any(Object),
    )
  })

  it('allows to configure a custom header', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: '12345' }))
    await ApiClient.get<{ data: string }>('/listings/search', {
      baseUrl: 'https://petstoreapi.ch',
      headers: { 'Content-Type': 'text/xml', 'Accept-Language': 'fr-CH' },
    })
    expect(fetch).toHaveBeenCalledWith(
      'https://petstoreapi.ch/listings/search',
      expect.objectContaining({
        headers: { 'Content-Type': 'text/xml', 'Accept-Language': 'fr-CH' },
      }),
    )
  })

  it('creates an authorization header if access token is passed', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: '12345' }))
    await ApiClient.get<{ data: string }>('/listings/search', {
      baseUrl: 'https://petstoreapi.ch',
      accessToken: 'abcdef',
    })
    expect(fetch).toHaveBeenCalledWith(
      'https://petstoreapi.ch/listings/search',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer abcdef' }),
      }),
    )
  })

  describe('get', () => {
    beforeEach(() => {
      ApiClient.configure({
        baseUrl: 'https://api.automotive.ch/api',
      })
    })

    it('calls fetch with GET', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: '12345' }))
      await ApiClient.get<{ data: string }>('/listings/search')
      expect(fetch).toHaveBeenCalledWith(
        'https://api.automotive.ch/api/listings/search',
        expect.objectContaining({ method: 'GET' }),
      )
    })

    it('extracts the json value of the response', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: '12345' }))
      const data = await ApiClient.get<{ data: string }>('/listings/search')
      expect(data.data).toEqual('12345')
    })

    it('throws if fetch fails', async () => {
      fetchMock.mockReject(new Error())
      await expect(ApiClient.get<string>('/listings/search')).rejects.toThrow()
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
      fetchMock.mockResponseOnce(JSON.stringify({ data: '12345' }))
      await ApiClient.get<string>('dealers/{dealerId}/listings/{dealerId}', {
        params: { dealerId: 123 },
      })
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('dealers/123/listings/123'),
        expect.any(Object),
      )
    })

    it('replaces the parameter placeholders with the data', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: '12345' }))
      await ApiClient.get<string>('dealers/{dealerId}/listings/{listingId}', {
        params: { dealerId: 123, listingId: 456 },
      })
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('dealers/123/listings/456'),
        expect.any(Object),
      )
    })
  })
})
