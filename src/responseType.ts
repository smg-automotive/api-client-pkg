import { PaginatedResponse } from './pagination';

type BaseError = {
  code: string;
  message: string;
};

type FieldError<RequestData> = BaseError & { property: keyof RequestData };

type Error<RequestData> = BaseError & {
  fieldErrors?: FieldError<RequestData>[];
  globalErrors?: BaseError[];
};

type LeanResponse = Pick<
  Response,
  'headers' | 'ok' | 'redirected' | 'status' | 'statusText' | 'type' | 'url'
>;

interface ErrorResponse<RequestData> extends LeanResponse {
  ok: false;
  body: Error<RequestData>;
}

interface SuccessResponse<Body> extends LeanResponse {
  ok: true;
  body: Body;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ResponseType<RequestData = any, Body = never> = Promise<
  ErrorResponse<RequestData> | SuccessResponse<Body>
>;
