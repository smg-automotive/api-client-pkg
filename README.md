# api-client-pkg

[![CircleCI](https://circleci.com/gh/smg-automotive/api-client-pkg/tree/main.svg?style=svg&circle-token=c183f151fea3c74453cf8dd962d31e115906a300)](https://circleci.com/gh/smg-automotive/example-pkg/tree/main)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## Usage

```
npm install @smg-automotive/api-client-pkg
```

### Configuration

The available instance methods are listed below. The specified config will be merged with the instance config.

````typescript
import { initApiClient } from "@smg-automotive/api-client-pkg"

initApiClient({
  baseUrl: 'https://api.automotive.ch/api',
  headers: { 'Accept-Language': 'fr-CH' },
})
````

| property | type   | default                                   |
|----------|--------|-------------------------------------------|
| baseUrl  | string | ""                                        |
| headers  | object | {  'Content-Type':  'application/json' }  |

### Creating a client

Create a new typescript file and define an interface that describes your API. The interface must extend
from `ClientConfiguration`. The key defines the path to the API (use curly brackets for dynamic parameters) and the
value defines the available methods for that path.

```typescript
import {
  ApiClient,
  ClientConfiguration,
  RequestType,
  RequestTypeWithBody,
  ResponseType,
} from "@smg-automotive/api-client-pkg"

interface UserListingComparisonClient extends ClientConfiguration {
  "users/me/listing-comparisons": {
    post: (
      request: RequestTypeWithBody<ListingComparison>
    ) => Promise<ResponseType<ListingComparisonCreateResponse>>
  }
  "users/me/listing-comparisons/{listingComparisonId}": {
    put: (
      request: RequestTypeWithBody<ListingComparison>
    ) => Promise<ResponseType>
    delete: (request: RequestType) => Promise<ResponseType>
    get: (request: RequestType) => Promise<ResponseType<ListingComparison>>
  }
}

export const comparisonClient = ApiClient<UserListingComparisonClient>()
```

### Using the client

Depending on your client configuration, you are going to get typing for the request and the response body.

```typescript
const res = await comparisonClient
  .path("users/me/listing-comparisons/{listingComparisonId}", {
    listingComparisonId: 1234,
  })
  .get()

// you can also use res.ok if you do not care about the specific code
if (res.status === 204) {
  // res.body is typed to ListingComparison
} else {
  // request failed
}
```

If you are using curly brackets for the dynamic parameters, you also get typing for the path parameters. Furthermore,
the api client replaces those occurrences automatically for you.

```typescript
await comparisonClient
  // this will fail with "Property 'listingComparisonId' is missing"
  .path("users/me/listing-comparisons/{listingComparisonId}", {})
  .get()

await comparisonClient
  // this will call fetch with https://yourBaseUrl.ch/users/me/listing-comparisons/1234
  .path("users/me/listing-comparisons/{listingComparisonId}", {
    listingComparisonId: 1234,
  })
  .get()
```

### Authorization

You can pass `accessToken` to the request options if you are talking to a protected API. The client will automatically
set the header with a Bearer token.

````typescript
// fetch is called with the header { Authorization: `Bearer ${accessToken}` }
await comparisonClient
  .path("users/me/listing-comparisons/{listingComparisonId}")
  .get({
    options: {
      accessToken: authHeader.accessToken,
    },
  })
````

### Error handling

The promise is not rejected if any error occurs on API level. You can check for `res.ok` or the http status code.

````typescript
const res = await comparisonClient
  .path("users/me/listing-comparisons/{listingComparisonId}")
  .get({
    options: {
      accessToken: authHeader.accessToken,
    },
  })

if (res.ok) {
  // it worked!
} else {
  // it did not work for some reason
}

if (res.status === 401) {
  // it did not work because user is not authorized!
  // res.ok is false
}
````

### Testing

Create a file in the `__mocks__` directory called `@smg-automotive/api-client-pkg.ts` with the following content:

````typescript
export { ApiClient } from "@smg-automotive/api-client-pkg/__mocks__/index"
````

By default, all the API calls will succeed and return an empty body. If you want to reject it or return a specific value
you can do this by setting a spy on the created client:

````typescript
import { comparisonClient } from "~/clients/userListingComparison"

jest
  .spyOn(
    comparisonClient.path(
      // note that this path matches the path you want to mock
      "users/me/listing-comparisons/{listingComparisonId}"
    ),
    "get"
  )
  .mockReturnValueOnce(
    Promise.resolve({
      status: 401,
      body: { error: "Unauthorized" },
      ok: false,
    })
  )
````

if you want to overwrite the mock behavior of all **used** api-client functions in your test file, you can also
use `jest.mock` for it:

````typescript
jest.mock("@smg-automotive/api-client-pkg", () => ({
  ApiClient: () => ({
    path: () => {
      return {
        get: jest.fn().mockReturnValue(
          Promise.resolve({
            status: 401,
            body: { error: "Unauthorized" },
            ok: false,
          })
        ),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
      }
    },
  }),
}))
````

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
