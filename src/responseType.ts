interface BaseResponse {
  ok: boolean;
  status: number;
  body?: unknown;
  headers?: Record<string, unknown>;
}

interface ErrorResponse extends BaseResponse {
  ok: false;
  status: 400 | 404 | 500;
  body: {
    message: string;
    errors?: Record<string, string>[];
  };
}

interface SuccessResponseWithBody<Body> extends BaseResponse {
  ok: true;
  status: 200;
  body: Body;
}

interface SuccessResponseWithoutBody extends BaseResponse {
  ok: true;
  status: 201 | 204;
  body?: never;
}

export type ResponseType<Body = never> =
  | ErrorResponse
  | SuccessResponseWithBody<Body>
  | SuccessResponseWithoutBody;
