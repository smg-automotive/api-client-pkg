/* eslint-disable @typescript-eslint/no-explicit-any */

import { ResponseType } from './responseType';

import { RequestOptions } from './index';

export interface RequestType {
  options?: RequestOptions;
}

export interface RequestTypeWithBody<T = any> extends RequestType {
  data: T;
}

type Methods = {
  get?: (request: RequestType) => Promise<ResponseType<any>>;
  post?: (request: RequestTypeWithBody) => Promise<ResponseType<any>>;
  put?: (request: RequestTypeWithBody) => Promise<ResponseType<any>>;
  delete?: (request: RequestType) => Promise<ResponseType<any>>;
};

export type ClientConfiguration = Record<string, Methods>;
