# api-client-pkg

[![CircleCI](https://circleci.com/gh/smg-automotive/api-client-pkg/tree/main.svg?style=svg&circle-token=c183f151fea3c74453cf8dd962d31e115906a300)](https://circleci.com/gh/smg-automotive/example-pkg/tree/main)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## Usage

```
npm install @smg-automotive/api-client-pkg
```

### Configuration

The available instance methods are listed below. The specified config will be merged with the instance config.

````javascript
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

````javascript
// fetch is called with baseUrl/dealers/123/listings/456
await ApiClient.get < string > ('dealers/{dealerId}/listings/{listingId}', {
  params: { dealerId: 123, listingId: 456 },
})
````

### Authorization

You can pass in `accessToken` to the request options if you are talking to a protected API. The client will
automatically set the header with a Bearer token.

### Error handling

### Testing

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
