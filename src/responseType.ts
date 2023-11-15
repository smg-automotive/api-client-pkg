import { Path } from './utils';

type BaseError = {
  code: string;
  message: string;
};

type FieldError<RequestData extends object> = BaseError & {
  property: Path<RequestData>;
};

type Error<RequestData extends object> = BaseError & {
  fieldErrors?: FieldError<RequestData>[];
  globalErrors?: BaseError[];
};

type LeanResponse = Pick<
  Response,
  'headers' | 'ok' | 'redirected' | 'status' | 'statusText' | 'type' | 'url'
>;

export interface ErrorResponse<RequestData extends object>
  extends LeanResponse {
  ok: false;
  body: Error<RequestData>;
}

export interface SuccessResponse<Body> extends LeanResponse {
  ok: true;
  body: Body;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UnwrapResponseUnion<T extends Awaited<ResponseType<any, any>>> =
  T extends SuccessResponse<infer Body> ? Body : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UnwrapResponseType<T extends ResponseType<any, any>> =
  UnwrapResponseUnion<Awaited<T>>;

export type ResponseType<
  RequestData extends object = object,
  Body = never,
> = Promise<ErrorResponse<RequestData> | SuccessResponse<Body>>;
