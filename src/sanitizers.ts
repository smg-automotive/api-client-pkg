import { RemoveIndex } from './utils';
import { ResponseType, UnwrapResponseType } from './responseType';

import { ClientConfiguration } from '.';

export type DataSanitizer<T> = (data: Partial<T>) => T;

export type Sanitizers<Configuration extends ClientConfiguration> = {
  [path in keyof RemoveIndex<Configuration>]?: {
    [method in keyof Configuration[path]]?: Configuration[path][method] extends (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...args: any
    ) => unknown
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ReturnType<Configuration[path][method]> extends ResponseType<any, any>
        ? DataSanitizer<
            UnwrapResponseType<ReturnType<Configuration[path][method]>>
          >
        : never
      : never;
  };
};
