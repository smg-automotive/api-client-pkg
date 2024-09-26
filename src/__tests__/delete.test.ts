import { listingClient } from '.jest/helpers/listingClient';
import { mockResolvedOnce, mockUnexpectedHTMLOnce } from '.jest/helpers/fetch';

describe('delete', () => {
  it('calls fetch with DELETE', async () => {
    mockResolvedOnce({ data: '12345' });
    await listingClient
      .path('/listings/{listingId}', { listingId: 123 })
      .delete();
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: 'DELETE' }),
    );
  });

  it('applies a sanitizer', async () => {
    mockResolvedOnce({});
    const response = await listingClient
      .path('/listings/{listingId}/unsanitized', { listingId: 1 })
      .delete();

    expect(response.body).toEqual({ make: 'default make' });
  });

  it('handles JSON parsing errors', async () => {
    expect.assertions(2);

    mockUnexpectedHTMLOnce();
    const response = await listingClient
      .path('/listings/{listingId}/unsanitized', { listingId: 1 })
      .delete();

    if (!response.ok) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(response.body.message).toEqual(
        'Failed to parse JSON response from https://api.automotive.ch/api/listings/1/unsanitized',
      );
      // eslint-disable-next-line jest/no-conditional-expect
      expect(response.body.globalErrors).toContainEqual(
        // eslint-disable-next-line jest/no-conditional-expect
        expect.objectContaining({
          code: 'JSON_PARSE_ERROR',
        }),
      );
    }
  });
});
