import { replaceParameters } from '../pathParameters';

describe('#replaceParameters', () => {
  it('returns the same string if no curly brackets are used', () => {
    expect(replaceParameters({ path: 'listing/search' })).toEqual(
      'listing/search',
    );
  });

  it('replaces a single parameter', () => {
    expect(
      replaceParameters({
        path: 'listing/{listingId}',
        params: { listingId: 123 },
      }),
    ).toEqual('listing/123');
  });

  it('replaces multiple parameters', () => {
    expect(
      replaceParameters({
        path: 'dealer/{dealerId}/listing/{listingId}',
        params: { dealerId: 111, listingId: 123 },
      }),
    ).toEqual('dealer/111/listing/123');
  });

  it('throws if a parameter is missing', () => {
    expect(() =>
      replaceParameters({
        path: 'dealer/{dealerId}/listing/{listingId}',
        params: { listingId: 123 },
      }),
    ).toThrow(/Parameter dealerId missing/);
  });

  it('throws if no parameters are passed', () => {
    expect(() =>
      replaceParameters({
        path: 'dealer/{dealerId}/listing/{listingId}',
      }),
    ).toThrow(/Expected parameters are: dealerId, listingId/);
  });
});
