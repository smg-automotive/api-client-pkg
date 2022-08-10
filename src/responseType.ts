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

export type ResponseType<Body = never, RequestData = never> = Promise<
  ErrorResponse<RequestData> | SuccessResponse<Body>
>;
