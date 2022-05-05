import fetchMock from 'jest-fetch-mock'
import ApiClient from '../index'

describe('ApiClient', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  describe('get', () => {
    beforeEach(() => {
      ApiClient.configure({
        baseUrl: 'https://api.automotive.ch/api',
      })
    })

    it('calls fetch with GET', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: '12345' }))
      await ApiClient.get<{ data: string }>('dealer/:dealerId/listings')
      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: 'GET' }),
      )
    })

    it('extracts the json value of the response', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: '12345' }))
      const data = await ApiClient.get<{ data: string }>(
        'dealer/:dealerId/listings',
      )
      expect(data.data).toEqual('12345')
    })

    it('throws if fetch fails', async () => {
      fetchMock.mockReject(new Error())
      await expect(
        ApiClient.get<string>('dealer/:dealerId/listings'),
      ).rejects.toThrow()
    })
  })
})
