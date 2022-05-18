import ResponseError from './ResponseError';

export interface ApiClientConfiguration {
  baseUrl: string;
  headers: Record<string, string>;
}

type RequestParameters = Record<string, string | number>;

export interface RequestOptions {
  baseUrl?: string;
  headers?: Record<string, string>;
  accessToken?: string;
}

class ApiClient {
  private configuration: ApiClientConfiguration = {
    baseUrl: '',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    headers: { 'Content-Type': 'application/json' },
  };

  private static replaceParameters({
    path,
    params,
  }: {
    path: string;
    params?: RequestParameters;
  }) {
    const parameters = path.match(/{(.*?)}/g) || [];

    if (!parameters.length) {
      return path;
    }

    let replacedPath = path;
    parameters.forEach((param) => {
      const value = params?.[param.slice(1, -1)];

      if (!value) {
        throw new Error(
          `Param ${param} missing. Expected parameters are: ${parameters.join(
            ', '
          )}`
        );
      }

      replacedPath = replacedPath.replace(param, `${value}`);
    });
    return replacedPath;
  }

  private getPath({
    path,
    params,
    options,
  }: {
    path: string;
    params?: RequestParameters;
    options?: RequestOptions;
  }) {
    const baseUrl = options?.baseUrl || this.configuration.baseUrl;
    if (!baseUrl) {
      throw new Error(
        'ApiClient is not configured. Please run ApiClient.configure() or pass a custom baseUrl.'
      );
    }
    const fetchPath = ApiClient.replaceParameters({ path, params });
    return [
      baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl,
      fetchPath.startsWith('/') ? fetchPath.slice(1) : fetchPath,
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

  private static async returnData(response: Response) {
    const text = await response.text();
    const data = text.length > 0 ? JSON.parse(text) : null;
    if (!response.ok) {
      throw new ResponseError(response, data);
    }
    return data;
  }

  configure = (configuration: Partial<ApiClientConfiguration>) => {
    this.configuration = {
      ...this.configuration,
      ...configuration,
    };
  };

  get = async <ResponseType>({
    path,
    params,
    options,
  }: {
    path: string;
    params?: RequestParameters;
    options?: RequestOptions;
  }): Promise<ResponseType> => {
    return ApiClient.returnData(
      await fetch(this.getPath({ path, params, options }), {
        method: 'GET',
        headers: this.getHeaders(options),
      })
    );
  };

  post = async <ResponseType, RequestType>({
    path,
    params,
    body,
    options,
  }: {
    path: string;
    params?: RequestParameters;
    body: RequestType;
    options?: RequestOptions;
  }): Promise<ResponseType> => {
    return ApiClient.returnData(
      await fetch(this.getPath({ path, params, options }), {
        method: 'POST',
        headers: this.getHeaders(options),
        body: body && JSON.stringify(body),
      })
    );
  };

  put = async <ResponseType, RequestType>({
    path,
    params,
    body,
    options,
  }: {
    path: string;
    params?: RequestParameters;
    body: RequestType;
    options?: RequestOptions;
  }): Promise<ResponseType> => {
    return ApiClient.returnData(
      await fetch(this.getPath({ path, params, options }), {
        method: 'PUT',
        headers: this.getHeaders(options),
        body: body && JSON.stringify(body),
      })
    );
  };

  delete = async ({
    path,
    params,
    options,
  }: {
    path: string;
    params?: RequestParameters;
    options?: RequestOptions;
  }): Promise<void> => {
    return ApiClient.returnData(
      await fetch(this.getPath({ path, params, options }), {
        method: 'DELETE',
        headers: this.getHeaders(options),
      })
    );
  };
}

const apiClient = new ApiClient();

export { ResponseError, apiClient as ApiClient };
