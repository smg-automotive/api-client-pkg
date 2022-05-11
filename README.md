# api-client-pkg

[![CircleCI](https://circleci.com/gh/smg-automotive/api-client-pkg/tree/main.svg?style=svg&circle-token=c183f151fea3c74453cf8dd962d31e115906a300)](https://circleci.com/gh/smg-automotive/example-pkg/tree/main)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## Usage

```
npm install @smg-automotive/api-client-pkg
```

````typescript
import { ApiClient } from "@smg-automotive/api-client-pkg"
````

### Configuration

The available instance methods are listed below. The specified config will be merged with the instance config.

````typescript
ApiClient.configure({
  baseUrl: 'https://api.automotive.ch/api',
  headers: { 'Content-Type': 'application/json' },
})
````

### Instance methods

The ApiClient provides promise-based methods for `GET`, `POST`, `PUT` and `DELETE`.

### Typing

You can define the request and the response type of your method as follows:

````typescript
interface Car {
  make: string
  horsepower: number
}

// data has type Car
var data = await ApiClient.get<Car>('/listings/search')

// data has type { id: string } and body is typed as Car
var data = await ApiClient.post<{ id: string }, Car>('/listings/create',
  { make: 'bmw', horsepower: 300 },)
````

### Parameters

If your request URL contains parameters, you can use curly brackets and the ApiClient replaces it with the passed data.
This is aligned with the OpenAPI specification used by Swagger. Hence, you can easily search for occurrences of your
APIs.

````typescript
// fetch is called with https://baseUrl.api.ch/dealers/123/listings/456
await ApiClient.get('dealers/{dealerId}/listings/{listingId}', {
  params: { dealerId: 123, listingId: 456 },
})
````

### Authorization

You can pass `accessToken` to the request options if you are talking to a protected API. The client will automatically
set the header with a Bearer token.

````typescript
// fetch is called with the header { Authorization: `Bearer ${accessToken}` }
await ApiClient.post<{ id: number }, { name: string; listingIds: number[] }>(
  "users/me/listing-comparisons",
  { name: "test1", listingIds: [890163] },
  { accessToken: authHeader.accessToken }
)
````

### Error handling

The promise is rejected if any error occurs on API level. You can use promise chaining or `try/catch` to add error
handling.

````typescript
ApiClient.post<LeasingCalculation, LeasingData>(
  "listings/calculate-leasing",
  {
    downPayment: 7300,
    duration: 48,
    estimatedKmPerYear: 10000,
    firstRegistrationDate: "2020-07-01",
    residualValue: 12045,
    price: 36500,
  }
)
  .then((res) => {
    // res is typed to LeasingCalculation
  })
  .catch((error: ResponseError) => {
    // do any error handling you want
  })


try {
  // res has the type LeasingCalculation
  const res = await ApiClient.post<LeasingCalculation, LeasingData>(
    "listings/calculate-leasing",
    {
      downPayment: 7300,
      duration: 48,
      estimatedKmPerYear: 10000,
      firstRegistrationDate: "2020-07-01",
      residualValue: 12045,
      price: 36500,
    }
  )
} catch (error: ResponseError) {
  // do any error handling you want
}
````

### Testing

Create a file in the `__mocks__` directory called `@smg-automotive/api-client-pkg.ts` with the following content:

````typescript
export const ApiClient = {
  get: jest.fn().mockReturnValue(Promise.resolve()),
  post: jest.fn().mockReturnValue(Promise.resolve()),
  put: jest.fn().mockReturnValue(Promise.resolve()),
  delete: jest.fn().mockReturnValue(Promise.resolve()),
}
````

By default, all the API calls will succeed. If you want to reject it or return a specific value you can do this as
follows:

````typescript
jest.spyOn(ApiClient, "get").mockImplementation((path, options) => {
  // do something with path and options (e.g. create a switch statement for the methods used)
  return Promise.resolve([{ name: "bmw", key: "bmw" }])
})

jest.spyOn(ApiClient, "get").mockImplementation((path, options) => {
  // do something with path and options (e.g. create a switch statement for the methods used)
  return Promise.reject(
    new ResponseError({ status: 422, statusText: "" }, "Some data from the response body")
  )
})

// or using mock
jest.mock("@smg-automotive/api-client-pkg", () => ({
  ApiClient: {
    get: jest
      .fn()
      .mockImplementation(() => Promise.resolve([{ name: "bmw", key: "bmw" }])),
  },
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
