type BaseError = {
  code: string;
  message: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TupleKeys<T extends ReadonlyArray<any>> = Exclude<keyof T, keyof any[]>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IsTuple<T extends ReadonlyArray<any>> = number extends T['length']
  ? false
  : true;

type ArrayKey = number;

type Primitive = null | undefined | string | number | boolean | symbol | bigint;
type BrowserNativeObject = Date | FileList | File;

type PathImpl<K extends string | number, V> = V extends
  | Primitive
  | BrowserNativeObject
  ? `${K}`
  : `${K}` | `${K}.${Path<V>}`;

export type Path<T> = T extends ReadonlyArray<infer V>
  ? IsTuple<T> extends true
    ? {
        [K in TupleKeys<T>]-?: PathImpl<K & string, T[K]>;
      }[TupleKeys<T>]
    : PathImpl<ArrayKey, V>
  : {
      [K in keyof T]-?: PathImpl<K & string, T[K]>;
    }[keyof T];

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
