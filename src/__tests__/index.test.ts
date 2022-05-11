import { ApiClient } from '../index'
import { mockFetchFailOnce, mockResolvedOnce } from '../../.jest/helpers/fetch'

describe('ApiClient', () => {
  it('throws if there is no baseUrl', async () => {
    await expect(async () => {
      await ApiClient.get<{ data: string }>('/listings/search')
    }).rejects.toThrow(
      'ApiClient is not configured. Please run ApiClient.configure() or pass a custom baseUrl.',
    )
  })

  it('throws if fetch fails', async () => {
    mockFetchFailOnce()
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

  it('removes duplicated slashes', async () => {
    mockResolvedOnce({ data: '12345' })
    await ApiClient.get<{ data: string }>('/listings/search', {
      baseUrl: 'https://petstoreapi.ch/',
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

  it('merges the custom header with the configuration', async () => {
    mockResolvedOnce({ data: '12345' })
    ApiClient.configure({
      baseUrl: 'https://api.automotive.ch/api',
      headers: {
        'Accept-Language': 'fr-CH',
      },
    })
    await ApiClient.get<{ data: string }>('/listings/search', {
      headers: { 'Content-Type': 'text/xml' },
    })
    expect(fetch).toHaveBeenCalledWith(
      'https://api.automotive.ch/api/listings/search',
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
})
