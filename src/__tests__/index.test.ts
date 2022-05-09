import ApiClient from '../index'

const fetchMock = jest.fn()
global.fetch = fetchMock

const mockResolvedOnce = (value: any) => {
  fetchMock.mockReturnValueOnce(
    Promise.resolve({
      ok: true,
      json: () => {
        return Promise.resolve(value)
      },
    }),
  )
}

const mockFetchFail = () => {
  fetchMock.mockReturnValueOnce(Promise.reject(new Error()))
}

const mockApiFail = () => {
  fetchMock.mockReturnValueOnce(
    Promise.resolve({
      ok: false,
      statusText: 'Wrong data format',
      status: 400,
    }),
  )
}

describe('ApiClient', () => {
  beforeEach(() => {
    fetchMock.mockReset()
  })

  it('throws if there is no baseUrl', () => {
    expect(() => {
      ApiClient.get<{ data: string }>('/listings/search')
    }).toThrow(
      'ApiClient is not configured. Please run ApiClient.configure() or pass a custom baseUrl.',
    )
  })

  it('throws if fetch fails', async () => {
    mockFetchFail()
    await expect(
      ApiClient.get<string>('/listings/search', { baseUrl: 'url' }),
    ).rejects.toThrow()
  })

  it('overwrites the configured baseUrl', async () => {
    ApiClient.configure({
      baseUrl: 'https://api.automotive.ch/api',
    })
    mockResolvedOnce({ data: '12345' })
    await ApiClient.get<{ data: string }>('/listings/search', {
      baseUrl: 'https://petstoreapi.ch',
    })
    expect(fetch).toHaveBeenCalledWith(
      'https://petstoreapi.ch/listings/search',
      expect.any(Object),
    )
  })

  it('allows to configure a custom header', async () => {
    mockResolvedOnce({ data: '12345' })
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
    mockResolvedOnce({ data: '12345' })
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
      mockApiFail()
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

  describe('post', () => {
    beforeEach(() => {
      ApiClient.configure({
        baseUrl: 'https://api.automotive.ch/api',
      })
    })

    it('calls fetch with POST', async () => {
      mockResolvedOnce({ id: '12345' })
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
      mockResolvedOnce({ id: '12345' })
      const data = await ApiClient.post<{ id: string }, { make: string }>(
        '/listings/create',
        { make: 'bmw' },
      )
      expect(data.id).toEqual('12345')
    })

    it('rejects if the request was not ok', async () => {
      mockApiFail()
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
  })

  describe('put', () => {
    beforeEach(() => {
      ApiClient.configure({
        baseUrl: 'https://api.automotive.ch/api',
      })
    })

    it('calls fetch with PUT', async () => {
      mockResolvedOnce({ id: '12345' })
      await ApiClient.put<string, { make: string }>('/listings/update', {
        make: 'bmw',
      })
      expect(fetch).toHaveBeenCalledWith(
        'https://api.automotive.ch/api/listings/update',
        expect.objectContaining({ method: 'PUT' }),
      )
    })

    it('extracts the json value of the response', async () => {
      mockResolvedOnce({ id: '12345' })
      const data = await ApiClient.put<{ id: string }, { make: string }>(
        '/listings/update',
        { make: 'bmw' },
      )
      expect(data.id).toEqual('12345')
    })

    it('rejects if the request was not ok', async () => {
      mockApiFail()
      await expect(
        ApiClient.put<string, string>('/listings/update', 'data'),
      ).rejects.toEqual(expect.any(Object))
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
      mockResolvedOnce({ data: '12345' })
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
      mockResolvedOnce({ data: '12345' })
      await ApiClient.delete('/listings/{listingId}', {
        params: { listingId: 123 },
      })
      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: 'DELETE' }),
      )
    })

    it('rejects if the request was not ok', async () => {
      mockApiFail()
      await expect(
        ApiClient.delete('/listings/{listingId}', {
          params: { listingId: 123 },
        }),
      ).rejects.toEqual(expect.any(Object))
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
      mockResolvedOnce({})
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
