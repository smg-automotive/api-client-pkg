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
          return ApiClient.get({ path: replacedPath });
        },
      };
    },
  } as { path: Path<Configuration> };
}
