import { SortedQuery, SortOrderParams, SortParams, SortQuery } from './sort';
import { Sanitizers } from './sanitizers';
import {
  ErrorResponse,
  ResponseType,
  StreamResponseType,
  StreamSuccessResponse,
  SuccessResponse,
} from './responseType';
import { replaceParameters } from './pathParameters';
import { Path } from './path';
import {
  PaginatedQuery,
  PaginatedResponse,
  PaginationQuery,
} from './pagination';
import { FetchClient } from './fetchClient';
import { ClientConfiguration, RequestType } from './configuration';

export interface SortedAndPaginatedQuery<
  Query,
  SortType,
> extends PaginatedQuery<Query> {
  sort: SortQuery<SortType>;
}

export interface FetchClientConfiguration {
  baseUrl: string;
  headers: Record<string, string>;
}

interface ApiClientConfiguration<
  Configuration extends ClientConfiguration,
> extends FetchClientConfiguration {
  sanitizers: Sanitizers<Configuration>;
}

export interface RequestOptions {
  baseUrl?: string;
  headers?: Record<string, string>;
  accessToken?: string | null;
  signal?: AbortSignal;
  cache?: 'no-store' | 'force-cache';
  next?: {
    revalidate?: false | 0 | number;
    tags?: string[];
  };
}

function StronglyTypedClient<Configuration extends ClientConfiguration>(
  configuration: Partial<ApiClientConfiguration<Configuration>> = {},
): {
  path: Path<Configuration>;
} {
  const fetchClient = new FetchClient(configuration);
  return {
    path: (path, params) => {
      const replacedPath = replaceParameters({
        path: path.toString(),
        params: params || {},
      });

      const pathSanitizers = configuration.sanitizers?.[path];

      return {
        get: ({ options, searchParams } = { options: {} }) => {
          return fetchClient.get({
            path: replacedPath,
            options,
            searchParams,
            sanitizer: pathSanitizers?.get,
          });
        },
        post: ({ data, options, searchParams } = { data: {}, options: {} }) => {
          return fetchClient.post({
            path: replacedPath,
            body: data,
            options,
            searchParams,
            sanitizer: pathSanitizers?.post,
          });
        },
        postStream: (
          { data, options, searchParams } = {
            data: {},
            options: {},
          },
        ) => {
          return fetchClient.postStream({
            path: replacedPath,
            body: data,
            options,
            searchParams,
          });
        },
        put: ({ data, options } = { data: {}, options: {} }) => {
          return fetchClient.put({
            path: replacedPath,
            body: data,
            options,
            sanitizer: pathSanitizers?.put,
          });
        },
        delete: ({ options, searchParams } = { options: {} }) => {
          return fetchClient.delete({
            path: replacedPath,
            options,
            searchParams,
            sanitizer: pathSanitizers?.delete,
          });
        },
      };
    },
  } as { path: Path<Configuration> };
}

export {
  StronglyTypedClient as ApiClient,
  ClientConfiguration,
  ResponseType,
  StreamResponseType,
  StreamSuccessResponse,
  RequestType,
  SuccessResponse,
  ErrorResponse,
  PaginatedQuery,
  PaginatedResponse,
  PaginationQuery,
  SortQuery,
  SortOrderParams,
  SortParams,
  SortedQuery,
};
