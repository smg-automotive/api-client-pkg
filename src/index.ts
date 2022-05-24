import { ResponseType } from './responseType';
import { replaceParameters } from './pathParameters';
import { Path } from './path';
import { FetchClient } from './fetchClient';
import { ClientConfiguration, RequestType } from './configuration';

export interface FetchClientConfiguration {
  baseUrl: string;
  headers: Record<string, string>;
}

export interface RequestOptions {
  baseUrl?: string;
  headers?: Record<string, string>;
  accessToken?: string;
}

function StronglyTypedClient<Configuration extends ClientConfiguration>(
  configuration: Partial<FetchClientConfiguration> = {}
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

export {
  StronglyTypedClient as ApiClient,
  ClientConfiguration,
  ResponseType,
  RequestType,
};
