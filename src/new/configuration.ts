import { Response } from './response';

type Methods = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get?: (data?: any) => Promise<Response<any>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post?: (data?: any) => Promise<Response<any>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  put?: (data?: any) => Promise<Response<any>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete?: (data?: any) => Promise<Response<any>>;
};

export type ClientConfiguration = Record<string, Methods>;
