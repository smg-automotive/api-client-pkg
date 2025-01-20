import { SortedQuery, SortOrderParams, SortParams, SortQuery } from './sort';
import { Sanitizers } from './sanitizers';
import { ErrorResponse, ResponseType, SuccessResponse } from './responseType';
import { replaceParameters } from './pathParameters';
import { Path } from './path';
import {
  PaginatedQuery,
  PaginatedResponse,
  PaginationQuery,
} from './pagination';
import { FetchClient } from './fetchClient';
import { ClientConfiguration, RequestType } from './configuration';

export interface SortedAndPaginatedQuery<Query, SortType>
  extends PaginatedQuery<Query> {
  sort: SortQuery<SortType>;
}

export interface FetchClientConfiguration {
  baseUrl: string;
  headers: Record<string, string>;
}

interface ApiClientConfiguration<Configuration extends ClientConfiguration>
  extends FetchClientConfiguration {
  sanitizers: Sanitizers<Configuration>;
}

export interface RequestOptions {
  baseUrl?: string;
  headers?: Record<string, string>;
  accessToken?: string;
  keepalive?: boolean;
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
        post: ({ data, options } = { data: {}, options: {} }) => {
          return fetchClient.post({
            path: replacedPath,
            body: data,
            options,
            sanitizer: pathSanitizers?.post,
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
        delete: ({ options } = { options: {} }) => {
          return fetchClient.delete({
            path: replacedPath,
            options,
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
