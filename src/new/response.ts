interface BaseResponse {
  status: number;
  body?: unknown;
  headers?: Record<string, unknown>;
}

interface ErrorResponse extends BaseResponse {
  status: 400 | 404 | 500;
  body: {
    message: string;
    errors?: Record<string, string>[];
  };
}

interface SuccessResponseWithBody<Body> extends BaseResponse {
  status: 200;
  body: Body;
}

interface SuccessResponseWithoutBody extends BaseResponse {
  status: 201;
  body?: never;
}

export type Response<Body = never> =
  | ErrorResponse
  | SuccessResponseWithBody<Body>
  | SuccessResponseWithoutBody;
