import { listingClient } from '@/jest/helpers/listingClient';
import {
  mockApiFailOnce,
  mockMissingStreamBodyOnce,
  mockResolvedStreamOnce,
} from '@/jest/helpers/fetch';

describe('postStream', () => {
  it('calls fetch with POST and returns the readable stream', async () => {
    const stream = new ReadableStream<Uint8Array>();

    mockResolvedStreamOnce(stream);

    const response = await listingClient
      .path('/listings/create-stream')
      .postStream({ data: { make: 'bmw' } });

    expect(fetch).toHaveBeenCalledWith(
      'https://api.automotive.ch/api/listings/create-stream',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ make: 'bmw' }),
      }),
    );

    expect(response.ok).toBe(true);
    if (response.ok) {
      expect(response.body).toBe(stream);
    }
  });

  it('passes the signal to fetch', async () => {
    const controller = new AbortController();

    mockResolvedStreamOnce();

    await listingClient.path('/listings/create-stream').postStream({
      data: { make: 'bmw' },
      options: { signal: controller.signal },
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://api.automotive.ch/api/listings/create-stream',
      expect.objectContaining({ signal: controller.signal }),
    );
  });

  it('adds searchParams on method POST stream', async () => {
    mockResolvedStreamOnce();

    await listingClient.path('/listings/create-stream').postStream({
      data: { make: 'bmw' },
      searchParams: { test: 'hereIAm' },
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://api.automotive.ch/api/listings/create-stream?test=hereIAm',
      expect.any(Object),
    );
  });

  it('returns the parsed API error response', async () => {
    mockApiFailOnce();

    const response = await listingClient
      .path('/listings/create-stream')
      .postStream({ data: { make: 'bmw' } });

    expect(response.ok).toBe(false);
    if (!response.ok) {
      expect(response.body.message).toBe('Wrong data format');
    }
  });

  it('returns an error when the stream body is missing', async () => {
    mockMissingStreamBodyOnce();

    const response = await listingClient
      .path('/listings/create-stream')
      .postStream({ data: { make: 'bmw' } });

    expect(response.ok).toBe(false);
    if (!response.ok) {
      expect(response.body.code).toBe('STREAM_RESPONSE_BODY_MISSING');
    }
  });
});
