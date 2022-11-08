type BaseError = {
  code: string;
  message: string;
};

type Path<ObjectType extends Record<string, unknown>> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends Record<
    string,
    unknown
  >
    ? `${Key}` | `${Key}.${Path<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

type FieldError<RequestData extends Record<string, unknown>> = BaseError & {
  property: Path<RequestData>;
};

type Error<RequestData extends Record<string, unknown>> = BaseError & {
  fieldErrors?: FieldError<RequestData>[];
  globalErrors?: BaseError[];
};

type LeanResponse = Pick<
  Response,
  'headers' | 'ok' | 'redirected' | 'status' | 'statusText' | 'type' | 'url'
>;

interface ErrorResponse<RequestData extends Record<string, unknown>>
  extends LeanResponse {
  ok: false;
  body: Error<RequestData>;
}

interface SuccessResponse<Body> extends LeanResponse {
  ok: true;
  body: Body;
}

export type ResponseType<
  RequestData extends Record<string, unknown> = Record<string, unknown>,
  Body = never
> = Promise<ErrorResponse<RequestData> | SuccessResponse<Body>>;
