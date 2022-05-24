/* eslint-disable @typescript-eslint/no-explicit-any */

import { ResponseType } from './responseType';

import { RequestOptions } from './index';

export interface RequestType<T = never> {
  options?: RequestOptions;
  data?: T;
}

type Methods = {
  get?: (request: RequestType) => ResponseType<any>;
  post?: (request: RequestType<any>) => ResponseType<any>;
  put?: (request: RequestType<any>) => ResponseType<any>;
  delete?: (request: RequestType) => ResponseType<any>;
};

export type ClientConfiguration = Record<string, Methods>;
