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

  describe('post', () => {
    beforeEach(() => {
      ApiClient.configure({
        baseUrl: 'https://api.automotive.ch/api',
      })
    })

    it('calls fetch with POST', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ id: '12345' }))
      await ApiClient.post<{ id: string }, { make: string }>(
        '/listings/create',
        { make: 'bmw' },
      )
      expect(fetch).toHaveBeenCalledWith(
        'https://api.automotive.ch/api/listings/create',
        expect.objectContaining({ method: 'POST' }),
      )
    })

    it('extracts the json value of the response', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ id: '12345' }))
      const data = await ApiClient.post<{ id: string }, { make: string }>(
        '/listings/create',
        { make: 'bmw' },
      )
      expect(data.id).toEqual('12345')
    })

    it('throws if fetch fails', async () => {
      fetchMock.mockReject(new Error())
      await expect(
        ApiClient.post<string, string>('/listings/create', 'data'),
      ).rejects.toThrow()
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
      fetchMock.mockResponseOnce(JSON.stringify({ data: '12345' }))
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
  })

  describe('put', () => {
    beforeEach(() => {
      ApiClient.configure({
        baseUrl: 'https://api.automotive.ch/api',
      })
    })

    it('calls fetch with PUT', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ id: '12345' }))
      await ApiClient.put<string, { make: string }>('/listings/update', {
        make: 'bmw',
      })
      expect(fetch).toHaveBeenCalledWith(
        'https://api.automotive.ch/api/listings/update',
        expect.objectContaining({ method: 'PUT' }),
      )
    })

    it('extracts the json value of the response', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ id: '12345' }))
      const data = await ApiClient.put<{ id: string }, { make: string }>(
        '/listings/update',
        { make: 'bmw' },
      )
      expect(data.id).toEqual('12345')
    })

    it('throws if fetch fails', async () => {
      fetchMock.mockReject(new Error())
      await expect(
        ApiClient.put<string, string>('/listings/update', 'data'),
      ).rejects.toThrow()
    })

    it('throws if no parameters are passed', () => {
      expect(() => {
        ApiClient.put<{ id: string }, { make: string }>(
          'dealers/{dealerId}/listings/{listingId}',
          { make: 'bmw' },
          {},
        )
      }).toThrow()
    })

    it('throws if a parameter is missing', async () => {
      expect(() => {
        ApiClient.put<{ id: string }, { make: string }>(
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
      fetchMock.mockResponseOnce(JSON.stringify({ data: '12345' }))
      await ApiClient.put<{ id: string }, { make: string }>(
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
  })

  describe('delete', () => {
    beforeEach(() => {
      ApiClient.configure({
        baseUrl: 'https://api.automotive.ch/api',
      })
    })

    it('calls fetch with DELETE', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: '12345' }))
      await ApiClient.delete('/listings/{listingId}', {
        params: { listingId: 123 },
      })
      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: 'DELETE' }),
      )
    })

    it('throws if fetch fails', async () => {
      fetchMock.mockReject(new Error())
      await expect(
        ApiClient.delete('/listings/{listingId}', {
          params: { listingId: 123 },
        }),
      ).rejects.toThrow()
    })

    it('throws if no parameters are passed', () => {
      expect(() => {
        ApiClient.delete('dealers/{dealerId}/listings/{listingId}', {})
      }).toThrow()
    })

    it('throws if a parameter is missing', async () => {
      expect(() => {
        ApiClient.delete('dealers/{dealerId}/listings/{listingId}', {
          params: { listingId: 456 },
        })
      }).toThrow(
        'Param {dealerId} missing. Expected parameters are: {dealerId}, {listingId}',
      )
    })

    it('replaces the parameter placeholders with the data', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({}))
      await ApiClient.delete('dealers/{dealerId}/listings/{listingId}', {
        params: { dealerId: 123, listingId: 456 },
      })
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('dealers/123/listings/456'),
        expect.any(Object),
      )
    })
  })
})
