import { RemoveIndex } from './utils';
import { ResponseType, UnwrapResponseType } from './responseType';

import { ClientConfiguration } from '.';

export type DataSanitizer<T> = (data: Partial<T>) => T;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApiCall = (...args: any) => ResponseType<any, any>;

export type Sanitizers<Configuration extends ClientConfiguration> = {
  // For every path in the configuration
  [Path in keyof RemoveIndex<Configuration>]?: {
    // and every method of that path that is an api call
    [Method in keyof Configuration[Path]]?: Configuration[Path][Method] extends ApiCall
      ? // sanitize the response body
        DataSanitizer<
          UnwrapResponseType<ReturnType<Configuration[Path][Method]>>
        >
      : never;
  };
};
