interface BaseResponse {
  ok: boolean;
  status: number;
  body?: unknown;
  headers?: Record<string, unknown>;
}

interface ErrorResponse extends BaseResponse {
  ok: false;
  status: 400 | 401 | 403 | 404 | 500;
  body: {
    message: string;
    errors?: Record<string, string>[];
  };
}

interface SuccessResponse<Body> extends BaseResponse {
  ok: true;
  status: 200 | 201 | 204;
  body: Body;
}

export type ResponseType<Body = never> = ErrorResponse | SuccessResponse<Body>;
