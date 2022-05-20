import { replaceParameters } from './pathParameters';
import { Path } from './path';
import { ClientConfiguration } from './configuration';
import { ApiClient } from '..';

export function StronglyTypedClient<
  Configuration extends ClientConfiguration
>(): {
  path: Path<Configuration>;
} {
  return {
    path: (path, params) => {
      const replacedPath = replaceParameters({
        path: path.toString(),
        params: params || {},
      });
      return {
        get: () => {
          // TODO: current client only exposes body not the response object
          return ApiClient.get({ path: replacedPath });
        },
        // TODO: remaining HTTP methods
      };
    },
  } as { path: Path<Configuration> };
}
