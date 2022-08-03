type FieldError = {
  code: string;
  message: string;
  property: string;
};

type GlobalError = {
  code: string;
  message: string;
};

type Error = {
  code: string;
  message: string;
  fieldErrors?: FieldError[];
  globalErrors?: GlobalError[];
};

type LeanResponse = Pick<
  Response,
  'headers' | 'ok' | 'redirected' | 'status' | 'statusText' | 'type' | 'url'
>;

interface ErrorResponse extends LeanResponse {
  ok: false;
  body: Error;
}

interface SuccessResponse<Body> extends LeanResponse {
  ok: true;
  body: Body;
}

export type ResponseType<Body = never> = Promise<
  ErrorResponse | SuccessResponse<Body>
>;
