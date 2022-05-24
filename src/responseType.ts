type Error = {
  error?: string;
  message?: string;
  errors?: Record<string, string>[];
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
