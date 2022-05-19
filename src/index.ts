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
        'ApiClient is not configured. Please run ApiClient.configure() or pass a custom baseUrl.'
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

  // TODO: implement options
  get = async <ResponseType>({
    path,
    options,
  }: {
    path: string;
    options?: RequestOptions;
  }): Promise<ResponseType> => {
    return ApiClient.returnData(
      await fetch(this.getPath({ path, options }), {
        method: 'GET',
        headers: this.getHeaders(options),
      })
    );
  };

  // TODO: implement without params
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

  // TODO: implement without params
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

  // TODO: implement without params
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

export interface ClientConfiguration {
  [path: string]: {
    get: () => Promise<any>;
    put: (input: any) => Promise<any>;
  };
}

export type PathParameter<TPath extends string> =
  // TODO: Dynamic tuple labels are not supported
  // TODO: Would be nice to have an object
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  TPath extends `${infer Head}/{${infer Parameter}}${infer Tail}`
    ? [pathParameter: string | number, ...params: PathParameter<Tail>]
    : [];

export type Path<StrongConfiguration extends ClientConfiguration> = <
  TPath extends keyof StrongConfiguration
>(
  path: TPath,
  // TODO: fix this typing error
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  ...pathParam: PathParameter<TPath>
) => StrongConfiguration[TPath];

const replaceParameters = ({
  path,
  params,
}: {
  path: string;
  params?: Array<string | number>;
}) => {
  const parameters = path.match(/{(.*?)}/g) || [];

  if (!parameters.length) {
    return path;
  }

  let replacedPath = path;
  parameters.forEach((param, index) => {
    const value = params?.[index];

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
};

export function StronglyTypedClient<
  StrongConfiguration extends ClientConfiguration
>(): {
  path: Path<StrongConfiguration>;
} {
  return {
    path: (path, ...pathParam) => {
      const replacedPath = replaceParameters({
        path: path as string,
        params: pathParam,
      });
      return {
        get: () => {
          return apiClient.get({ path: replacedPath });
        },
      };
    },
    // TODO: can we remove this casting?
  } as { path: Path<StrongConfiguration> };
}
