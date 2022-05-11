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
  private configuration: ApiClientConfiguration = {
    baseUrl: '',
    headers: { 'Content-Type': 'application/json' },
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

      replacedPath = replacedPath.replace(param, `${value}`)
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
    const fetchPath = ApiClient.replaceParameters(path, options)
    return [
      baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl,
      fetchPath.startsWith('/') ? fetchPath.slice(1) : fetchPath,
    ].join('/')
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
    const size = Number(response.headers.get('content-length') || 0)
    const data = size > 0 ? await response.json() : null
    if (!response.ok) {
      throw new ResponseError(response, data)
    }
    return data
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
      body: body && JSON.stringify(body),
    }).then((response) => {
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
      body: body && JSON.stringify(body),
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

const apiClient = new ApiClient()

export { ResponseError, apiClient as ApiClient }
