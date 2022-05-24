type Error = {
  error?: string;
  message?: string;
  errors?: Record<string, string>[];
};

interface ErrorResponse extends Omit<Response, 'body'> {
  ok: false;
  body: Error;
}

interface SuccessResponse<Body> extends Omit<Response, 'body'> {
  ok: true;
  body: Body;
}

export type ResponseType<Body = never> = Promise<
  ErrorResponse | SuccessResponse<Body>
>;
