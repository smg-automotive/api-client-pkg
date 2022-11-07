# api-client-pkg

[![CircleCI](https://circleci.com/gh/smg-automotive/api-client-pkg/tree/main.svg?style=svg&circle-token=c183f151fea3c74453cf8dd962d31e115906a300)](https://circleci.com/gh/smg-automotive/example-pkg/tree/main)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## Usage

```
npm install @smg-automotive/api-client-pkg
```

### Creating a client

Create a new typescript file and define an interface that describes your API. The interface must
extend `ClientConfiguration`. The key defines the path to the API (use curly brackets for dynamic parameters) and the
values define available methods for that path.

```typescript
import {
  ApiClient,
  ClientConfiguration,
  RequestType,
  ResponseType,
} from '@smg-automotive/api-client-pkg';

interface ComparisonClientConfiguration extends ClientConfiguration {
  'users/me/listing-comparisons': {
    get: () => ResponseType<ListingComparison[]>;
    post: (
      request: RequestType<ListingComparison>
    ) => ResponseType<ListingComparisonCreateResponse>;
  };
  'users/me/listing-comparisons/{listingComparisonId}': {
    put: (request: RequestType<ListingComparison>) => ResponseType;
    delete: (request: RequestType) => ResponseType;
    get: (request: RequestType) => ResponseType<ListingComparison>;
  };
}

export const comparisonClient = ApiClient<ComparisonClientConfiguration>({
  baseUrl: 'https://api.automotive.ch/api',
  headers: {
    // your custom headers
  },
});
```

Each client needs to be configured by its own. The default values are:

| property | type   | default                                |
| -------- | ------ | -------------------------------------- |
| baseUrl  | string | ""                                     |
| headers  | object | { 'Content-Type': 'application/json' } |

If you pass a custom configuration for a single API call with the RequestType object, the configuration is
merged/overwritten.

```typescript
await comparisonClient
  .path('users/me/listing-comparisons/{listingComparisonId}', {
    listingComparisonId: 1234,
  })
  .get({
    options: {
      baseUrl: 'https://someCustomBaseUrlForThatApi',
      headers: {
        // your custom headers
      },
      accessToken: 'your token',
    },
  });
```

#### Paginated requests

Backend APIs may implement standardized paginated endpoints.  
You can use the following helper types to type the request and response
for an API providing paginated content.

```typescript
interface VersionsClientConfiguration extends ClientConfiguration {
  'versions/search': {
    post: (
      request: RequestType<PaginatedQuery<VersionBody>, never>
    ) => ResponseType<never, PaginatedResponse<Version>>;
  };
}
```

### Using the client

Depending on your client configuration, you are going to get typing for the request and the response body. The body is
parsed and transformed to an object by the client.

```typescript
const response = await comparisonClient
  .path('users/me/listing-comparisons/{listingComparisonId}', {
    listingComparisonId: 1234,
  })
  .get();

if (response.ok) {
  // response.body is typed to ListingComparison
} else {
  // something failed
}
```

If you are using curly brackets for the dynamic parameters, you also get typing for the path parameters. Furthermore,
the api client replaces those occurrences automatically for you.

```typescript
await comparisonClient
  // this will fail with "Property 'listingComparisonId' is missing"
  .path('users/me/listing-comparisons/{listingComparisonId}', {})
  .get();

await comparisonClient
  // this will call fetch with https://yourBaseUrl.ch/users/me/listing-comparisons/1234
  .path('users/me/listing-comparisons/{listingComparisonId}', {
    listingComparisonId: 1234,
  })
  .get();
```

### Authorization

You can pass `accessToken` to the request options if you are talking to a protected API. The client will automatically
set the header with a Bearer token.

```typescript
// fetch is called with the header { Authorization: `Bearer ${accessToken}` }
await comparisonClient
  .path('users/me/listing-comparisons/{listingComparisonId}', {
    listingComparisonId: 1234,
  })
  .get({
    options: {
      accessToken: authHeader.accessToken,
    },
  });
```

### Error handling

The promise is not rejected if any error occurs on API level (
see [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API#differences_from_jquery) documentation for
reference). You can check for `response.ok` to know whether the request was successful or not and to get typing on the
body object.

```typescript
const response = await comparisonClient
  .path('users/me/listing-comparisons/{listingComparisonId}', {
    listingComparisonId: 1234,
  })
  .get({
    options: {
      accessToken: authHeader.accessToken,
    },
  });

if (response.ok) {
  // it worked!
} else {
  // it did not work for some reason
  if (response.status === 401) {
    // it did not work because user is not authorized!
  }
}
```

### Testing

Create a file in the `__mocks__` directory called `@smg-automotive/api-client-pkg.ts` with the following content:

```typescript
export { ApiClient } from '@smg-automotive/api-client-pkg/dist/__mocks__/index';
```

By default, all the API calls will succeed and return an empty body. If you want to return a specific value you can do
this by setting a spy on the created client:

```typescript
import { comparisonClient } from '~/clients/userListingComparison';

jest.spyOn(comparisonClient, 'path').mockReturnValueOnce({
  get: jest.fn().mockReturnValueOnce(
    Promise.resolve({
      status: 401,
      body: { error: 'Unauthorized' },
      ok: false,
    })
  ),
});
```

if you want to overwrite the mock behavior of all **used** api-client functions in your test file, you can also
use `jest.mock` for it:

```typescript
jest.mock('@smg-automotive/api-client-pkg', () => ({
  ApiClient: () => ({
    path: () => {
      return {
        get: jest.fn().mockReturnValue(
          Promise.resolve({
            status: 401,
            body: { error: 'Unauthorized' },
            ok: false,
          })
        ),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
      };
    },
  }),
}));
```

## Development

```
npm run build
```

You can link your local npm package to integrate it with any local project:

```
cd smg-automotive-example-pkg
npm run build

cd <project directory>
npm link ../smg-automotive-example-pkg
```

## Release a new version

New versions are released on the ci using semantic-release as soon as you merge into master. Please make sure your merge
commit message adheres to the corresponding conventions.
