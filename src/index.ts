import ResponseError from './ResponseError'

export interface ApiClientConfiguration {
  baseUrl: string
  headers: Record<string, string>
}

export interface RequestOptions {
  baseUrl?: string
  headers?: Record<string, string>
  params?: Record<string, string | number>
  accessToken?: string
}

class ApiClient {
  // eslint-disable-next-line no-use-before-define
  private static instance: ApiClient

  private configuration: ApiClientConfiguration

  private constructor() {
    this.configuration = {
      baseUrl: '',
      headers: { 'Content-Type': 'application/json' },
    }
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient()
    }
    return ApiClient.instance
  }

  private static replaceParameters(path: string, options?: RequestOptions) {
    const parameters = path.match(/{(.*?)}/g) || []

    if (!parameters.length) {
      return path
    }

    let replacedPath = path
    parameters.forEach((param) => {
      const value = options?.params?.[param.slice(1, -1)]

      if (!value) {
        throw new Error(
          `Param ${param} missing. Expected parameters are: ${parameters.join(
            ', ',
          )}`,
        )
      }

      replacedPath = replacedPath.replace(param, String(value))
    })
    return replacedPath
  }

  private getPath(path: string, options?: RequestOptions) {
    const baseUrl = options?.baseUrl || this.configuration.baseUrl
    if (!baseUrl) {
      throw new Error(
        'ApiClient is not configured. Please run ApiClient.configure() or pass a custom baseUrl.',
      )
    }

    return `${baseUrl}${
      path.startsWith('/') ? '' : '/'
    }${ApiClient.replaceParameters(path, options)}`
  }

  private getHeaders(options?: RequestOptions): Record<string, string> {
    return {
      ...this.configuration.headers,
      ...options?.headers,
      ...(options?.accessToken
        ? { Authorization: `Bearer ${options.accessToken}` }
        : {}),
    }
  }

  private static async returnData(response: Response) {
    const data = await response.text()
    return response.ok
      ? Promise.resolve(data ? JSON.parse(data) : null)
      : Promise.reject(new ResponseError(response, data))
  }

  configure = (configuration: Partial<ApiClientConfiguration>) => {
    this.configuration = {
      ...this.configuration,
      ...configuration,
    }
  }

  get = <ResponseType>(
    path: string,
    options?: RequestOptions,
  ): Promise<ResponseType> => {
    return fetch(this.getPath(path, options), {
      method: 'GET',
      headers: this.getHeaders(options),
    }).then((response) => {
      return ApiClient.returnData(response)
    })
  }

  post = <ResponseType, RequestType>(
    path: string,
    body: RequestType,
    options?: RequestOptions,
  ): Promise<ResponseType> => {
    return fetch(this.getPath(path, options), {
      method: 'POST',
      headers: this.getHeaders(options),
      body: JSON.stringify(body),
    }).then((response) => {
      // TODO: JSON parse needed?
      return ApiClient.returnData(response)
    })
  }

  put = <ResponseType, RequestType>(
    path: string,
    body: RequestType,
    options?: RequestOptions,
  ): Promise<ResponseType> => {
    return fetch(this.getPath(path, options), {
      method: 'PUT',
      headers: this.getHeaders(options),
      body: JSON.stringify(body),
    }).then((response) => {
      return ApiClient.returnData(response)
    })
  }

  delete = (path: string, options?: RequestOptions): Promise<void> => {
    return fetch(this.getPath(path, options), {
      method: 'DELETE',
      headers: this.getHeaders(options),
    }).then((response) => {
      return ApiClient.returnData(response)
    })
  }
}

export { ResponseError }
export default ApiClient.getInstance()
