import { ResponseType } from './responseType';
import { replaceParameters } from './pathParameters';
import { Path } from './path';
import { fetchClient } from './fetchClient';
import {
  ClientConfiguration,
  RequestType,
  RequestTypeWithBody,
} from './configuration';

export interface FetchClientConfiguration {
  baseUrl: string;
  headers: Record<string, string>;
}

export interface RequestOptions {
  baseUrl?: string;
  headers?: Record<string, string>;
  accessToken?: string;
}

function StronglyTypedClient<Configuration extends ClientConfiguration>(): {
  path: Path<Configuration>;
} {
  return {
    path: (path, params) => {
      const replacedPath = replaceParameters({
        path: path.toString(),
        params: params || {},
      });
      return {
        get: ({ options } = { options: {} }) => {
          return fetchClient.get({ path: replacedPath, options });
        },
        post: ({ data, options } = { data: {}, options: {} }) => {
          return fetchClient.post({ path: replacedPath, body: data, options });
        },
        put: ({ data, options } = { data: {}, options: {} }) => {
          return fetchClient.put({ path: replacedPath, body: data, options });
        },
        delete: ({ options } = { options: {} }) => {
          return fetchClient.delete({ path: replacedPath, options });
        },
      };
    },
  } as { path: Path<Configuration> };
}

const initApiClient = (
  configuration: Partial<FetchClientConfiguration> = {}
) => {
  fetchClient.init(configuration);
};

export {
  StronglyTypedClient as ApiClient,
  initApiClient,
  ClientConfiguration,
  ResponseType,
  RequestType,
  RequestTypeWithBody,
};
