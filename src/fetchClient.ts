import { DataSanitizer } from './sanitizers';
import { ErrorResponse, ResponseType, SuccessResponse } from './responseType';

import {
  FetchClientConfiguration,
  RequestOptions,
  RequestOptionsWithCache,
} from './index';

export class FetchClient {
  private readonly configuration: FetchClientConfiguration = {
    baseUrl: '',
    headers: { 'Content-Type': 'application/json' },
  };

  constructor(configuration: Partial<FetchClientConfiguration> = {}) {
    this.configuration = {
      ...this.configuration,
      ...configuration,
    };
  }

  private getPath({
    path,
    options,
    searchParams,
  }: {
    path: string;
    options?: RequestOptions;
    searchParams?: Record<string, string>;
  }) {
    const baseUrl = options?.baseUrl || this.configuration.baseUrl;
    if (!baseUrl) {
      throw new Error('FetchClient is not configured. Please pass a baseUrl.');
    }
    const normalizedPath = [
      baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl,
      path.startsWith('/') ? path.slice(1) : path,
    ].join('/');

    const urlSearchParams = new URLSearchParams(searchParams).toString();
    const queryString = urlSearchParams ? `?${urlSearchParams}` : '';

    return `${normalizedPath}${queryString}`;
  }

  private getHeaders(options?: RequestOptions): Record<string, string> {
    return {
      ...this.configuration.headers,
      ...options?.headers,
      ...(options?.accessToken
        ? { Authorization: `Bearer ${options.accessToken}` }
        : {}),
    };
  }

  private static async buildResponseDataObject<
    ResponseData,
    RequestData extends object,
  >(
    response: Response,
    passedBody: (
      | ErrorResponse<RequestData>
      | SuccessResponse<ResponseData>
    )['body'],
  ): ResponseType<RequestData, ResponseData> {
    const { headers, ok, redirected, status, statusText, type, url } = response;
    const baseResponse = {
      headers,
      redirected,
      status,
      statusText,
      type,
      url,
    };

    if (ok) {
      return {
        ok: true,
        body: passedBody as SuccessResponse<ResponseData>['body'],
        ...baseResponse,
      };
    }

    return {
      ok: false,
      body: passedBody as ErrorResponse<RequestData>['body'],
      ...baseResponse,
    };
  }

  private static async returnData<ResponseData, RequestData extends object>(
    response: Response,
    sanitizer?: DataSanitizer<ResponseData>,
  ): ResponseType<RequestData, ResponseData> {
    const text = await response.text();
    if (text.length === 0) {
      return FetchClient.buildResponseDataObject(response, {} as ResponseData);
    }

    try {
      const parsedBody: ResponseData = JSON.parse(text);
      return FetchClient.buildResponseDataObject(
        response,
        sanitizer ? sanitizer(parsedBody) : parsedBody,
      );
    } catch (error) {
      const { url } = response;

      // Custom HTML error
      if (
        error instanceof Error &&
        error.message.trim().match(/Unexpected token .* JSON/)
      ) {
        return FetchClient.buildResponseDataObject({ ...response, ok: false }, {
          message: `Failed to parse JSON response from ${url}`,
          globalErrors: [
            {
              code: 'JSON_PARSE_ERROR',
              message: error.message,
            },
          ],
        } as ResponseData);
      }

      throw error;
    }
  }

  get = async <T>({
    path,
    options,
    searchParams,
    sanitizer,
  }: {
    path: string;
    options?: RequestOptionsWithCache;
    searchParams?: Record<string, string>;
    sanitizer?: DataSanitizer<T>;
  }): ResponseType<object, T> => {
    return FetchClient.returnData(
      await fetch(this.getPath({ path, options, searchParams }), {
        method: 'GET',
        headers: this.getHeaders(options),
        ...(options?.cache ? { cache: options.cache } : {}),
        ...(options?.next ? { next: options.next } : {}),
      }),
      sanitizer,
    );
  };

  post = async <T>({
    path,
    body: originalBody,
    options,
    searchParams,
    sanitizer,
  }: {
    path: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: any;
    options?: RequestOptions;
    searchParams?: Record<string, string>;
    sanitizer?: DataSanitizer<T>;
  }): ResponseType<object, T> => {
    const headers = this.getHeaders(options);
    let body = originalBody && JSON.stringify(originalBody);

    // Form data needs to be plain with no content type set
    if (originalBody instanceof FormData) {
      delete headers['Content-Type'];
      body = originalBody;
    }

    return FetchClient.returnData(
      await fetch(this.getPath({ path, options, searchParams }), {
        method: 'POST',
        headers,
        body,
      }),
      sanitizer,
    );
  };

  put = async <T>({
    path,
    body,
    options,
    sanitizer,
  }: {
    path: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: any;
    options?: RequestOptions;
    sanitizer?: DataSanitizer<T>;
  }): ResponseType<object, T> => {
    return FetchClient.returnData(
      await fetch(this.getPath({ path, options }), {
        method: 'PUT',
        headers: this.getHeaders(options),
        body: body && JSON.stringify(body),
      }),
      sanitizer,
    );
  };

  delete = async <T>({
    path,
    options,
    searchParams,
    sanitizer,
  }: {
    path: string;
    options?: RequestOptions;
    searchParams?: Record<string, string>;
    sanitizer?: DataSanitizer<T>;
  }): ResponseType<object, T> => {
    return FetchClient.returnData(
      await fetch(this.getPath({ path, options, searchParams }), {
        method: 'DELETE',
        headers: this.getHeaders(options),
      }),
      sanitizer,
    );
  };
}
