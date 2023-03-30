import { DataSanitizer } from './sanitizers';
import { ResponseType } from './responseType';

import { FetchClientConfiguration, RequestOptions } from './index';

export class FetchClient {
  private readonly configuration: FetchClientConfiguration = {
    baseUrl: '',
    // eslint-disable-next-line @typescript-eslint/naming-convention
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
    const queryString = `${urlSearchParams ? '?' : ''}${
      urlSearchParams ? urlSearchParams : ''
    }`;

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

  private static async returnData<T>(
    response: Response,
    sanitizer?: DataSanitizer<T>
  ): ResponseType<object, T> {
    try {
      const text = await response.text();
      const data = text.length > 0 ? JSON.parse(text) : {};
      const { headers, ok, redirected, status, statusText, type, url } = response;
      return {
        headers,
        ok,
        redirected,
        status,
        statusText,
        type,
        url,
        body: sanitizer ? sanitizer(data) : data,
      };
    } catch (error) {
      console.error(`Error while parsing response: ${error.message}`);
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
    options?: RequestOptions;
    searchParams?: Record<string, string>;
    sanitizer?: DataSanitizer<T>;
  }): ResponseType<object, T> => {
    return FetchClient.returnData(
      await fetch(this.getPath({ path, options, searchParams }), {
        method: 'GET',
        headers: this.getHeaders(options),
      }),
      sanitizer
    );
  };

  post = async <T>({
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
        method: 'POST',
        headers: this.getHeaders(options),
        body: body && JSON.stringify(body),
      }),
      sanitizer
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
      sanitizer
    );
  };

  delete = async <T>({
    path,
    options,
    sanitizer,
  }: {
    path: string;
    options?: RequestOptions;
    sanitizer?: DataSanitizer<T>;
  }): ResponseType<object, T> => {
    return FetchClient.returnData(
      await fetch(this.getPath({ path, options }), {
        method: 'DELETE',
        headers: this.getHeaders(options),
      }),
      sanitizer
    );
  };
}
