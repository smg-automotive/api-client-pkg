import { ResponseType } from './responseType';

import { FetchClientConfiguration, RequestOptions } from './index';
type RequestParameters = Record<string, string | number>;

class FetchClient {
  private configuration: FetchClientConfiguration = {
    baseUrl: '',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    headers: { 'Content-Type': 'application/json' },
  };

  private getPath({
    path,
    options,
  }: {
    path: string;
    params?: RequestParameters;
    options?: RequestOptions;
  }) {
    const baseUrl = options?.baseUrl || this.configuration.baseUrl;
    if (!baseUrl) {
      throw new Error(
        'FetchClient is not configured. Please run initApiClient() or pass a custom baseUrl.'
      );
    }
    return [
      baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl,
      path.startsWith('/') ? path.slice(1) : path,
    ].join('/');
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

  private static async returnData(response: Response): Promise<ResponseType> {
    const text = await response.text();
    const data = text.length > 0 ? JSON.parse(text) : {};
    return {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore status may differ from our types
      status: response.status,
      ok: response.ok,
      body: data,
    };
  }

  init = (configuration: Partial<FetchClientConfiguration>) => {
    this.configuration = {
      ...this.configuration,
      ...configuration,
    };
  };

  get = async ({
    path,
    options,
  }: {
    path: string;
    options?: RequestOptions;
  }): Promise<ResponseType> => {
    return FetchClient.returnData(
      await fetch(this.getPath({ path, options }), {
        method: 'GET',
        headers: this.getHeaders(options),
      })
    );
  };

  post = async ({
    path,
    body,
    options,
  }: {
    path: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: any;
    options?: RequestOptions;
  }): Promise<ResponseType> => {
    return FetchClient.returnData(
      await fetch(this.getPath({ path, options }), {
        method: 'POST',
        headers: this.getHeaders(options),
        body: body && JSON.stringify(body),
      })
    );
  };

  put = async ({
    path,
    body,
    options,
  }: {
    path: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: any;
    options?: RequestOptions;
  }): Promise<ResponseType> => {
    return FetchClient.returnData(
      await fetch(this.getPath({ path, options }), {
        method: 'PUT',
        headers: this.getHeaders(options),
        body: body && JSON.stringify(body),
      })
    );
  };

  delete = async ({
    path,
    options,
  }: {
    path: string;
    options?: RequestOptions;
  }): Promise<ResponseType> => {
    return FetchClient.returnData(
      await fetch(this.getPath({ path, options }), {
        method: 'DELETE',
        headers: this.getHeaders(options),
      })
    );
  };
}

export const fetchClient = new FetchClient();