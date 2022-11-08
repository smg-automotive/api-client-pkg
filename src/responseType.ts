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

interface ErrorResponse<RequestData extends object> extends LeanResponse {
  ok: false;
  body: Error<RequestData>;
}

interface SuccessResponse<Body> extends LeanResponse {
  ok: true;
  body: Body;
}

export type ResponseType<
  RequestData extends object = object,
  Body = never
> = Promise<ErrorResponse<RequestData> | SuccessResponse<Body>>;
