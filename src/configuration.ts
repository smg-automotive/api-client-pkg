/* eslint-disable @typescript-eslint/no-explicit-any */

import { ResponseType } from './responseType';

import { RequestOptions } from './index';

export type RequestType<DataType = never, SearchParamsType = never> = {
  options?: RequestOptions;
  data?: DataType;
  searchParams?: SearchParamsType;
};

type Methods = {
  get?: (request: RequestType) => ResponseType<never, any>;
  post?: (request: RequestType<any>) => ResponseType<any, any>;
  put?: (request: RequestType<any>) => ResponseType<any, any>;
  delete?: (request: RequestType) => ResponseType<never, any>;
};

export type ClientConfiguration = Record<string, Methods>;
