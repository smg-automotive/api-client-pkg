export interface ApiClientConfiguration {
  baseUrl: string
  headers: Record<string, string>
}

export interface RequestOptions extends ApiClientConfiguration {
  params?: Record<string, string | number>
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

  private getPath(path: string, options?: RequestOptions) {
    const baseUrl = options?.baseUrl || this.configuration.baseUrl
    if (!baseUrl) {
      throw new Error(
        'ApiClient is not configured. Please run ApiClient.configure()',
      )
    }

    // TODO: magic with replacement

    return `${baseUrl}${path}`
  }

  configure = (configuration: ApiClientConfiguration) => {
    this.configuration = configuration
  }

  get = <ResponseType>(
    path: string,
    options?: RequestOptions,
  ): Promise<ResponseType> => {
    return fetch(this.getPath(path, options)).then((res) => {
      return res.json()
    })
  }

  post = <ResponseType, RequestType>(
    path: string,
    body: RequestType,
    options?: RequestOptions,
  ): Promise<ResponseType> => {
    return fetch(this.getPath(path, options), {
      method: 'POST',
      body: JSON.stringify(body),
    }).then((res) => {
      return res.json()
    })
  }

  put = <ResponseType, RequestType>(
    path: string,
    body: RequestType,
    options?: RequestOptions,
  ): Promise<ResponseType> => {
    return fetch(this.getPath(path, options), {
      method: 'PUT',
      body: JSON.stringify(body),
    }).then((res) => {
      return res.json()
    })
  }

  delete = (path: string, options?: RequestOptions): Promise<void> => {
    return fetch(this.getPath(path, options), {
      method: 'DELETE',
    }).then((res) => {
      return res.json()
    })
  }
}

export default ApiClient.getInstance()
